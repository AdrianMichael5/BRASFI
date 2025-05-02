"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AppNavbar } from "@/components/app-navbar";
import { NavigationSidebar } from "@/components/navigation-sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Heart,
  MessageCircle,
  MoreVertical,
  Send,
  ImageIcon,
  Trash,
} from "lucide-react";
import { getInitials, getRandomColor } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Interface para os posts do feed
interface Post {
  id: string;
  content: string;
  image?: string;
  createdAt: number;
  likes: number;
  comments: number;
  author: {
    name: string;
    avatar?: string;
    role: string;
  };
}

// Posts de exemplo para o feed
const defaultPosts: Post[] = [
  {
    id: "1",
    content:
      "Estamos felizes em anunciar nossa nova parceria com a Universidade Federal para o desenvolvimento de projetos sustentáveis! 🌱 #Sustentabilidade #NovasParceiras",
    image: "/placeholder.svg?height=400&width=600&text=Anúncio+de+Parceria",
    createdAt: Date.now() - 3600000 * 2, // 2 horas atrás
    likes: 24,
    comments: 5,
    author: {
      name: "Equipe BRASFI",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Administrador",
    },
  },
  {
    id: "2",
    content:
      "Confira as fotos do nosso último workshop sobre finanças sustentáveis! Foi um sucesso total com mais de 50 participantes. Agradecemos a todos que compareceram e contribuíram para as discussões. O próximo evento já está sendo planejado! 📊💰",
    image:
      "/placeholder.svg?height=400&width=600&text=Workshop+Finanças+Sustentáveis",
    createdAt: Date.now() - 86400000, // 1 dia atrás
    likes: 42,
    comments: 8,
    author: {
      name: "Maria Silva",
      role: "Coordenadora de Eventos",
    },
  },
  {
    id: "3",
    content:
      "Lembrete: As inscrições para o programa de mentoria em liderança sustentável encerram nesta sexta-feira! Não perca a oportunidade de desenvolver suas habilidades com os melhores profissionais do mercado. Link para inscrição na bio. ⏰",
    createdAt: Date.now() - 172800000, // 2 dias atrás
    likes: 18,
    comments: 3,
    author: {
      name: "Carlos Mendes",
      role: "Diretor de Programas",
    },
  },
];

export default function AppPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [isPostingLoading, setIsPostingLoading] = useState(false);

  // Verificar se o usuário está autenticado
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const userData = localStorage.getItem("user");

    if (!isAuthenticated || !userData) {
      router.push("/auth/login");
    } else {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (e) {
        console.error("Erro ao analisar dados do usuário:", e);
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("user");
        router.push("/auth/login");
      }
    }

    setIsLoading(false);
  }, [router]);

  // Carregar posts do localStorage ou usar os padrões
  useEffect(() => {
    const savedPosts = localStorage.getItem("feed_posts");
    if (savedPosts) {
      try {
        const parsedPosts = JSON.parse(savedPosts);
        setPosts(parsedPosts);
      } catch (e) {
        console.error("Erro ao carregar posts:", e);
        setPosts(defaultPosts);
      }
    } else {
      setPosts(defaultPosts);
      localStorage.setItem("feed_posts", JSON.stringify(defaultPosts));
    }
  }, []);

  // Função para criar um novo post (apenas para administradores)
  const handleCreatePost = () => {
    if (!newPostContent.trim() || !user?.isAdmin) return;

    setIsPostingLoading(true);

    const newPost: Post = {
      id: Date.now().toString(),
      content: newPostContent,
      createdAt: Date.now(),
      likes: 0,
      comments: 0,
      author: {
        name: user.name,
        avatar: user.avatar,
        role: "Administrador",
      },
    };

    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem("feed_posts", JSON.stringify(updatedPosts));
    setNewPostContent("");

    setTimeout(() => {
      setIsPostingLoading(false);
    }, 500);
  };

  // Função para formatar a data de criação do post
  const formatPostDate = (timestamp: number) => {
    const now = Date.now();
    const diffInSeconds = Math.floor((now - timestamp) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} segundos atrás`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)} minutos atrás`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)} horas atrás`;
    } else {
      return `${Math.floor(diffInSeconds / 86400)} dias atrás`;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <AppNavbar user={user} />
      <div className="flex flex-1 overflow-hidden">
        <NavigationSidebar />
        <div className="flex-1 overflow-auto">
          <div className="container max-w-2xl mx-auto py-6 px-4">
            <h1 className="text-2xl font-bold mb-6">Feed Geral</h1>

            {/* Área de criação de post (apenas para administradores) */}
            {user.isAdmin && (
              <Card className="mb-8 p-4 shadow-xl border-gray-50">
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0"
                    style={{ backgroundColor: getRandomColor(user.name) }}
                  >
                    {getInitials(user.name)}
                  </div>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Compartilhe novidades da empresa..."
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      className="mb-3 resize-none"
                      rows={3}
                    />
                    <div className="flex justify-between items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <ImageIcon className="h-4 w-4" />
                        <span>Adicionar Imagem</span>
                      </Button>
                      <Button
                        onClick={handleCreatePost}
                        disabled={!newPostContent.trim() || isPostingLoading}
                        className="flex items-center gap-2 border-2 text-white bg-blue-500 border-blue-500"
                      >
                        {isPostingLoading ? (
                          "Publicando..."
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            <span>Publicar</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Feed de posts */}
            <div className="space-y-6">
              {posts.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500">
                    Nenhuma publicação disponível.
                  </p>
                </div>
              ) : (
                posts.map((post) => (
                  <Card key={post.id} className="overflow-hidden shadow-xl border-gray-50">
                    {/* Cabeçalho do post */}
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                      <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0"
                    style={{ backgroundColor: getRandomColor(user.name) }}
                  >
                    {getInitials(post.author.name)}
                  </div>
                        <div>
                          <div className="font-medium">{post.author.name}</div>
                          <div className="text-xs text-gray-500">
                            {post.author.role}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="text-xs text-gray-500 mr-2">
                          {formatPostDate(post.createdAt)}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 cursor-pointer hover:bg-blue-100"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-white text-black"
                          >
                            <DropdownMenuItem className="text-black hover:bg-blue-50 hover:text-blue-600 rounded-md cursor-pointer transition-colors duration-200">Salvar post</DropdownMenuItem>
                            {user.isAdmin && (
                              <DropdownMenuItem className="text-red-600 hover:bg-red-50 hover:text-red-700 rounded-md cursor-pointer transition-colors duration-200">
                                Excluir
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Conteúdo do post */}
                    <div className="px-4 pb-3">
                      <p className="whitespace-pre-line">{post.content}</p>
                    </div>

                    {/* Imagem do post (se houver) */}
                    {post.image && (
                      <div className="relative w-full h-80">
                        <Image
                          src={post.image || "/placeholder.svg"}
                          alt="Imagem do post"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    {/* Área de interação */}
                    <div className="p-4 border-t border-gray-600">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-1 text-gray-600 hover:bg-blue-100 cursor-pointer"
                          >
                            <Heart className="h-5 w-5 cursor-pointer" />
                            <span>{post.likes}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-1 text-gray-600 hover:bg-blue-100 cursor-pointer"
                          >
                            <MessageCircle className="h-5 w-5 cursor-pointer" />
                            <span>{post.comments}</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
