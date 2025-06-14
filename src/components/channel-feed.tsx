"use client";

import type React from "react";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Info, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getInitials, getRandomColor } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  timestamp: number;
  user: {
    name: string;
    avatar: string;
    role: string;
    isAdmin: boolean;
  };
  image?: string;
}

interface Channel {
  id: string;
  name: string;
  description?: string;
  isAnnouncement?: boolean;
}

interface ChannelFeedProps {
  channel: Channel;
}

export function ChannelFeed({ channel }: ChannelFeedProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Carregar usuário atual
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setCurrentUser(parsedUser);
      } catch (e) {
        console.error("Erro ao analisar dados do usuário:", e);
      }
    }
  }, []);

  // Atualizar usuário atual quando o canal mudar
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setCurrentUser(parsedUser);
      } catch (e) {
        console.error("Erro ao atualizar dados do usuário:", e);
      }
    }
  }, [channel.id]);

  // Carregar mensagens do canal
  useEffect(() => {
    const channelMessages = localStorage.getItem(`messages_${channel.id}`);
    if (channelMessages) {
      try {
        const parsedMessages = JSON.parse(channelMessages);
        setMessages(parsedMessages);
      } catch (e) {
        console.error("Erro ao carregar mensagens:", e);
      }
    } else {
      // Se não houver mensagens, criar algumas mensagens de exemplo
      const exampleMessages = generateExampleMessages(channel);
      setMessages(exampleMessages);
      localStorage.setItem(
        `messages_${channel.id}`,
        JSON.stringify(exampleMessages)
      );
    }
  }, [channel.id, channel]);

  // Rolar para a última mensagem quando as mensagens mudarem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !currentUser) return;

    // Verificar se o usuário pode enviar mensagens no canal de avisos
    if (channel.isAnnouncement) {
      // Buscar informações atualizadas do usuário diretamente do localStorage
      const freshUserData = localStorage.getItem("user");
      let isCurrentUserAdmin = false;

      if (freshUserData) {
        try {
          const freshUser = JSON.parse(freshUserData);
          isCurrentUserAdmin = freshUser.isAdmin === true;
        } catch (e) {
          console.error("Erro ao verificar permissões do usuário:", e);
        }
      }

      if (!isCurrentUserAdmin) {
        alert(
          "Apenas administradores podem enviar mensagens no canal de avisos."
        );
        return;
      }
    }

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      timestamp: Date.now(),
      user: {
        name: currentUser.name,
        avatar: currentUser.avatar,
        role: currentUser.isAdmin ? "Administrador" : "Membro",
        isAdmin: currentUser.isAdmin,
      },
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);

    // Salvar mensagens no localStorage
    localStorage.setItem(
      `messages_${channel.id}`,
      JSON.stringify(updatedMessages)
    );

    // Limpar campo de mensagem
    setNewMessage("");
  };

  // Formatar data para exibição
  const formatMessageTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return `Hoje ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  // Gerar mensagens de exemplo para canais vazios
  const generateExampleMessages = (channel: Channel): Message[] => {
    const roles = {
      mariam: "UX/UI Designer",
      miller: "Product Manager",
      yevhen: "UX/UI Designer",
      boston: "UX/UI Designer",
      nagano: "Data Analyst",
    };

    if (channel.id === "design-project") {
      return [
        {
          id: "1",
          content:
            "Olá pessoal, espero que todos estejam bem hoje. Temos um novo projeto de design pela frente, e eu gostaria de iniciar nossa discussão.",
          timestamp: Date.now() - 3600000 * 2, // 2 horas atrás
          user: {
            name: "Mariam",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mariam",
            role: "UX/UI Designer",
            isAdmin: true,
          },
        },
        {
          id: "2",
          content:
            "Olá Mariam e equipe, estou ansioso para este projeto. Qual é o escopo do nosso trabalho de design?",
          timestamp: Date.now() - 3600000, // 1 hora atrás
          user: {
            name: "Miller",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=miller",
            role: "Product Manager",
            isAdmin: false,
          },
        },
        {
          id: "3",
          content:
            "Olá a todos! Antes de entrarmos nos detalhes, preparei uma breve visão geral do projeto. Vamos projetar um site para nosso cliente, uma cafeteria local. Eles estão procurando um design moderno, limpo e atraente para mostrar seus cafés especiais e doces.",
          timestamp: Date.now() - 1800000, // 30 minutos atrás
          user: {
            name: "Yevhen",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=yevhen",
            role: "UX/UI Designer",
            isAdmin: false,
          },
          image:
            "/sitecafebrasfi.png?height=200&width=400&text=Coffee+Shop+Mockup",
        },
        {
          id: "4",
          content:
            "Isso parece ótimo! Quais são os elementos-chave de design em que devemos nos concentrar?",
          timestamp: Date.now() - 900000, // 15 minutos atrás
          user: {
            name: "Boston",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=boston",
            role: "UX/UI Designer",
            isAdmin: false,
          },
        },
      ];
    }

    if (channel.id === "general") {
      return [
        {
          id: "1",
          content:
            "Bem-vindo ao canal geral! Este é um espaço para discussões gerais da equipe.",
          timestamp: Date.now() - 86400000, // 1 dia atrás
          user: {
            name: "Sistema",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=system",
            role: "Bot",
            isAdmin: true,
          },
        },
      ];
    }

    return [
      {
        id: "1",
        content: `Bem-vindo ao canal #${channel.name}!`,
        timestamp: Date.now() - 86400000, // 1 dia atrás
        user: {
          name: "Sistema",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=system",
          role: "Bot",
          isAdmin: true,
        },
      },
    ];
  };

  // Verificar se o usuário atual é administrador (usando dados atualizados)
  const isUserAdmin = () => {
    // Buscar informações atualizadas do usuário diretamente do localStorage
    const freshUserData = localStorage.getItem("user");
    if (freshUserData) {
      try {
        const freshUser = JSON.parse(freshUserData);
        return freshUser.isAdmin === true;
      } catch (e) {
        console.error("Erro ao verificar status de administrador:", e);
      }
    }
    return currentUser?.isAdmin === true;
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Channel Header */}
      <div className="flex items-center px-4 py-3 border-b border-green-800">
        <div className="flex-1">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold text-gray-800">
              #{channel.name}
            </h1>
            {channel.isAnnouncement && (
              <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                Somente Admins
              </span>
            )}
            {channel.description && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 ml-1"
                    >
                      <Info className="h-4 w-4 text-gray-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{channel.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          {channel.description && (
            <p className="text-sm text-gray-500">{channel.description}</p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          {messages.map((message) => (
            <div key={message.id} className="flex">
              {/* Avatar com inicial */}
              <div className="mr-3 flex-shrink-0">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white font-medium"
                  style={{
                    backgroundColor: getRandomColor(message.user.name),
                  }}
                >
                  {getInitials(message.user.name)}
                </div>
              </div>

              {/* Conteúdo da mensagem */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline">
                  <span className="font-medium text-gray-900 mr-2">
                    {message.user.name}
                  </span>
                  <span className="text-xs text-gray-500 mr-2">
                    {message.user.role}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatMessageTime(message.timestamp)}
                  </span>
                </div>
                <p className="text-gray-800 mt-1">{message.content}</p>

                {message.image && (
                  <div className="mt-2 max-w-md">
                    <Image
                      src={message.image || "/placeholder.svg"}
                      alt="Imagem anexada"
                      width={400}
                      height={200}
                      className="rounded-md border border-gray-200"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200">
        <form
          onSubmit={handleSendMessage}
          className="flex items-center space-x-2"
        >
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={
              channel.isAnnouncement && isUserAdmin()
                ? "Enviar anúncio..."
                : channel.isAnnouncement
                ? "Apenas administradores podem enviar mensagens aqui"
                : "Enviar mensagem..."
            }
            disabled={channel.isAnnouncement && !isUserAdmin()}
            className="flex-1"
          />
          <Button
            type="submit"
            size="icon"
            className="bg-blue-500 cursor-pointer"
            disabled={channel.isAnnouncement && !isUserAdmin()}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Enviar</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
