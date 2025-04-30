"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Trash, Shield, MessageSquareX } from "lucide-react";
import { cn, getInitials, getRandomColor } from "@/lib/utils";

interface User {
  name: string;
  email: string;
  isAdmin: boolean;
  avatar?: string;
}

interface Channel {
  id: string;
  name: string;
  description?: string;
  isAnnouncement?: boolean;
}

interface Category {
  id: string;
  name: string;
  channels: Channel[];
}

interface Message {
  id: string;
  content: string;
  timestamp: number;
  user: {
    name: string;
    email: string;
    avatar: string;
    role: string;
    isAdmin: boolean;
  };
  image?: string;
  channelId: string;
}

export function AdminPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newChannelName, setNewChannelName] = useState("");
  const [newChannelDescription, setNewChannelDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isAnnouncement, setIsAnnouncement] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Carregar dados ao iniciar
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Carregar usuário atual
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setCurrentUser(parsedUser);

        // Verificar se é admin
        if (!parsedUser.isAdmin) {
          alert(
            "Você não tem permissão para acessar o painel de administração."
          );
          return;
        }
      } catch (e) {
        console.error("Erro ao analisar dados do usuário:", e);
        return;
      }
    }

    // Carregar usuários
    const usersData = localStorage.getItem("users");
    if (usersData) {
      try {
        const parsedUsers = JSON.parse(usersData);
        setUsers(parsedUsers);
      } catch (e) {
        console.error("Erro ao carregar usuários:", e);
      }
    }

    // Carregar categorias e canais
    const categoriesData = localStorage.getItem("categories");
    if (categoriesData) {
      try {
        const parsedCategories = JSON.parse(categoriesData);
        setCategories(parsedCategories);
        if (parsedCategories.length > 0 && !selectedCategory) {
          setSelectedCategory(parsedCategories[0].id);
        }
      } catch (e) {
        console.error("Erro ao carregar categorias:", e);
      }
    }

    // Carregar todas as mensagens de todos os canais
    const allMessages: Message[] = [];
    const channelIds: string[] = [];

    categories.forEach((category) => {
      category.channels.forEach((channel) => {
        channelIds.push(channel.id);
      });
    });

    channelIds.forEach((channelId) => {
      const channelMessages = localStorage.getItem(`messages_${channelId}`);
      if (channelMessages) {
        try {
          const parsedMessages = JSON.parse(channelMessages);
          // Adicionar o channelId a cada mensagem
          const messagesWithChannel = parsedMessages.map((msg: any) => ({
            ...msg,
            channelId,
          }));
          allMessages.push(...messagesWithChannel);
        } catch (e) {
          console.error(`Erro ao carregar mensagens do canal ${channelId}:`, e);
        }
      }
    });

    setMessages(allMessages);
  };

  // Promover/rebaixar usuário
  const toggleAdminStatus = (email: string) => {
    const updatedUsers = users.map((user) => {
      if (user.email === email) {
        return { ...user, isAdmin: !user.isAdmin };
      }
      return user;
    });

    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // Atualizar o usuário logado se for ele mesmo
    if (currentUser && currentUser.email === email) {
      const updatedCurrentUser = {
        ...currentUser,
        isAdmin: !currentUser.isAdmin,
      };
      setCurrentUser(updatedCurrentUser);
      localStorage.setItem("user", JSON.stringify(updatedCurrentUser));
    }

    alert(
      `Usuário ${email} ${
        updatedUsers.find((u) => u.email === email)?.isAdmin
          ? "promovido a"
          : "removido de"
      } administrador.`
    );
  };

  // Criar novo canal
  const handleCreateChannel = () => {
    if (!newChannelName.trim() || !selectedCategory) {
      alert("Por favor, preencha o nome do canal e selecione uma categoria.");
      return;
    }

    const newChannel: Channel = {
      id: newChannelName.toLowerCase().replace(/\s+/g, "-"),
      name: newChannelName.trim(),
      description: newChannelDescription.trim() || undefined,
      isAnnouncement: isAnnouncement,
    };

    const updatedCategories = categories.map((category) => {
      if (category.id === selectedCategory) {
        // Verificar se já existe um canal com este ID
        if (category.channels.some((c) => c.id === newChannel.id)) {
          alert("Já existe um canal com este nome nesta categoria.");
          return category;
        }
        return {
          ...category,
          channels: [...category.channels, newChannel],
        };
      }
      return category;
    });

    setCategories(updatedCategories);
    localStorage.setItem("categories", JSON.stringify(updatedCategories));

    // Limpar campos
    setNewChannelName("");
    setNewChannelDescription("");
    setIsAnnouncement(false);

    alert(`Canal #${newChannel.name} criado com sucesso!`);
  };

  // Deletar canal
  const deleteChannel = (categoryId: string, channelId: string) => {
    if (
      !confirm(
        `Tem certeza que deseja excluir o canal #${channelId}? Esta ação não pode ser desfeita.`
      )
    ) {
      return;
    }

    const updatedCategories = categories.map((category) => {
      if (category.id === categoryId) {
        return {
          ...category,
          channels: category.channels.filter(
            (channel) => channel.id !== channelId
          ),
        };
      }
      return category;
    });

    setCategories(updatedCategories);
    localStorage.setItem("categories", JSON.stringify(updatedCategories));

    // Remover mensagens do canal
    localStorage.removeItem(`messages_${channelId}`);

    // Atualizar lista de mensagens
    setMessages(messages.filter((msg) => msg.channelId !== channelId));

    alert(`Canal #${channelId} excluído com sucesso!`);
  };

  // Deletar mensagem
  const deleteMessage = (channelId: string, messageId: string) => {
    if (
      !confirm(
        "Tem certeza que deseja excluir esta mensagem? Esta ação não pode ser desfeita."
      )
    ) {
      return;
    }

    // Obter mensagens do canal
    const channelMessagesJson = localStorage.getItem(`messages_${channelId}`);
    if (channelMessagesJson) {
      try {
        const channelMessages = JSON.parse(channelMessagesJson);
        const updatedChannelMessages = channelMessages.filter(
          (msg: any) => msg.id !== messageId
        );

        // Salvar mensagens atualizadas
        localStorage.setItem(
          `messages_${channelId}`,
          JSON.stringify(updatedChannelMessages)
        );

        // Atualizar lista de mensagens
        setMessages(
          messages.filter(
            (msg) => !(msg.channelId === channelId && msg.id === messageId)
          )
        );

        alert("Mensagem excluída com sucesso!");
      } catch (e) {
        console.error("Erro ao excluir mensagem:", e);
        alert("Erro ao excluir mensagem. Tente novamente.");
      }
    }
  };

  if (!currentUser?.isAdmin) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="w-[450px]">
          <CardHeader>
            <CardTitle>Acesso Restrito</CardTitle>
            <CardDescription>
              Você não tem permissão para acessar esta página.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Esta área é reservada para administradores do sistema.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Painel de Administração</h1>

      <Tabs defaultValue="channels" className="w-full">
  <TabsList className="mb-4 bg-gray-200 border rounded-lg p-1">
    <TabsTrigger
      value="channels"
      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white
                 text-gray-700 px-4 py-2 rounded-md transition"
    >
      Canais
    </TabsTrigger>
    <TabsTrigger
      value="users"
      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white
                 text-gray-700 px-4 py-2 rounded-md transition"
    >
      Usuários
    </TabsTrigger>
    <TabsTrigger
      value="messages"
      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white
                 text-gray-700 px-4 py-2 rounded-md transition"
    >
      Mensagens
    </TabsTrigger>
  </TabsList>

        {/* Gerenciamento de Usuários */}
        <TabsContent value="users">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Gerenciar Usuários</CardTitle>
              <CardDescription>
                Promova ou rebaixe usuários do sistema.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.length === 0 ? (
                  <p className="text-gray-500">Nenhum usuário encontrado.</p>
                ) : (
                  <div className="border border-gray-200 rounded-md overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="text-left p-3 text-gray-700">
                            Usuário
                          </th>
                          <th className="text-left p-3 text-gray-700">Email</th>
                          <th className="text-left p-3 text-gray-700">Admin</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr
                            key={user.email}
                            className="border-b border-gray-200 hover:bg-gray-50"
                          >
                            <td className="p-3 flex items-center">
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium mr-2 ring-2 ring-blue-200"
                                style={{
                                  backgroundColor: getRandomColor(user.email),
                                }}
                              >
                                {getInitials(user.name || user.email)}
                              </div>
                              <span className="text-gray-800">
                                {user.name || user.email.split("@")[0]}
                              </span>
                            </td>
                            <td className="p-3 text-gray-600">{user.email}</td>
                            <td className="p-3">
                              <Switch
                                checked={user.isAdmin}
                                onCheckedChange={() =>
                                  toggleAdminStatus(user.email)
                                }
                              />
                            </td>
                            {/* Removido o botão aqui */}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gerenciamento de Canais */}
        <TabsContent value="channels">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Criar Canal */}
            <Card>
              <CardHeader>
                <CardTitle>Criar Novo Canal</CardTitle>
                <CardDescription>
                  Adicione um novo canal a uma categoria existente.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <select
                      id="category"
                      className="w-full p-2 border rounded-md"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="">Selecione uma categoria</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="channelName">Nome do Canal</Label>
                    <Input
                      id="channelName"
                      value={newChannelName}
                      onChange={(e) => setNewChannelName(e.target.value)}
                      placeholder="ex: design-project"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="channelDescription">
                      Descrição (opcional)
                    </Label>
                    <Input
                      id="channelDescription"
                      value={newChannelDescription}
                      onChange={(e) => setNewChannelDescription(e.target.value)}
                      placeholder="Descreva o propósito deste canal"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isAnnouncement"
                      checked={isAnnouncement}
                      onCheckedChange={setIsAnnouncement}
                    />
                    <Label
                      htmlFor="isAnnouncement"
                      className="text-sm font-medium text-gray-900"
                    >
                      Canal de Anúncios (somente admins podem postar)
                    </Label>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="hover:bg-blue-50 text-blue-600 border-2 border-blue-200 cursor-pointer"
                  onClick={handleCreateChannel}
                >
                  + Criar Canal
                </Button>
              </CardFooter>
            </Card>

            {/* Listar e Excluir Canais */}
            <Card>
              <CardHeader>
                <CardTitle>Canais Existentes</CardTitle>
                <CardDescription>
                  Gerencie os canais existentes no sistema.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categories.length === 0 ? (
                    <p>Nenhuma categoria encontrada.</p>
                  ) : (
                    categories.map((category) => (
                      <div key={category.id} className="space-y-2">
                        <h3 className="font-semibold">{category.name}</h3>
                        {category.channels.length === 0 ? (
                          <p className="text-sm text-gray-500">
                            Nenhum canal nesta categoria.
                          </p>
                        ) : (
                          <ul className="space-y-2">
                            {category.channels.map((channel) => (
                              <li
                                key={channel.id}
                                className="flex items-center justify-between p-2 border rounded-md"
                              >
                                <div>
                                  <span className="font-medium">
                                    #{channel.name}
                                  </span>
                                  {channel.isAnnouncement && (
                                    <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                                      Anúncios
                                    </span>
                                  )}
                                  {channel.description && (
                                    <p className="text-sm text-gray-500">
                                      {channel.description}
                                    </p>
                                  )}
                                </div>
                                <Button
                                  className=" rounded-md px-3 h-8 flex items-center gap-2"
                                  variant="destructive"
                                  size="sm"
                                  onClick={() =>
                                    deleteChannel(category.id, channel.id)
                                  }
                                >
                                  <Trash className="h-5 w-5 text-red-500 cursor-pointer" />
                                </Button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Gerenciamento de Mensagens */}
        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Mensagens</CardTitle>
              <CardDescription>
                Visualize e exclua mensagens de qualquer canal.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <p>Nenhuma mensagem encontrada.</p>
                ) : (
                  <div className="border rounded-md">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3">Usuário</th>
                          <th className="text-left p-3">Canal</th>
                          <th className="text-left p-3">Mensagem</th>
                          <th className="text-left p-3">Data</th>
                          <th className="text-right p-3">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {messages
                          .slice()
                          .reverse()
                          .map((message) => {
                            // Encontrar o nome do canal
                            let channelName = message.channelId;
                            for (const category of categories) {
                              const channel = category.channels.find(
                                (c) => c.id === message.channelId
                              );
                              if (channel) {
                                channelName = channel.name;
                                break;
                              }
                            }

                            return (
                              <tr
                                key={`${message.channelId}-${message.id}`}
                                className="border-b"
                              >
                                <td className="p-3">
                                  <div className="flex items-center">
                                    <div
                                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium mr-2"
                                      style={{
                                        backgroundColor: getRandomColor(
                                          message.user.name
                                        ),
                                      }}
                                    >
                                      {getInitials(message.user.name)}
                                    </div>
                                    <span>{message.user.name}</span>
                                  </div>
                                </td>
                                <td className="p-3">#{channelName}</td>
                                <td className="p-3">
                                  <div className="max-w-xs truncate">
                                    {message.content}
                                  </div>
                                </td>
                                <td className="p-3">
                                  {new Date(message.timestamp).toLocaleString()}
                                </td>
                                <td className="p-3 text-right">
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() =>
                                      deleteMessage(
                                        message.channelId,
                                        message.id
                                      )
                                    }
                                  >
                                    <MessageSquareX className="h-4 w-4" />
                                  </Button>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
