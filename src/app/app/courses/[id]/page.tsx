"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppLayoutWithoutSidebar } from "@/components/app-layout-without-sidebar";
import {
  Users,
  Clock,
  BookOpen,
  MessageSquare,
  FileText,
  Download,
  Share2,
  ThumbsUp,
  Bookmark,
  ChevronLeft,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Curso {
  id: number;
  titulo: string;
  descricao: string;
  icone: string;
  metaArrecadacao: number;
  valorArrecadado: number;
  inscritos: string[];
  videoUrl?: string;
  materiais?: {
    id: number;
    titulo: string;
    tipo: "pdf" | "link" | "texto";
    url?: string;
    conteudo?: string;
  }[];
  comentarios?: {
    id: number;
    usuario: string;
    texto: string;
    data: string;
    respostas?: {
      id: number;
      usuario: string;
      texto: string;
      data: string;
    }[];
  }[];
}

export default function CursoDetalhesPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [curso, setCurso] = useState<Curso | null>(null);
  const [tempoAssistido, setTempoAssistido] = useState(0);
  const [novoComentario, setNovoComentario] = useState("");
  const [comentarioRespondido, setComentarioRespondido] = useState<number | null>(null);
  const [respostaComentario, setRespostaComentario] = useState("");

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

  // Carregar dados do curso
  useEffect(() => {
    const savedCursos = localStorage.getItem("cursos");
    if (savedCursos) {
      try {
        const parsedCursos = JSON.parse(savedCursos);
        const cursoEncontrado = parsedCursos.find(
          (c: Curso) => c.id === Number(params.id)
        );
        if (cursoEncontrado) {
          setCurso(cursoEncontrado);
        } else {
          router.push("/app/courses");
        }
      } catch (e) {
        console.error("Erro ao carregar curso:", e);
        router.push("/app/courses");
      }
    }
  }, [params.id, router]);

  // Simular atualização do tempo assistido
  useEffect(() => {
    if (curso) {
      const interval = setInterval(() => {
        setTempoAssistido((prev) => prev + 1);
      }, 60000); // Incrementa a cada minuto

      return () => clearInterval(interval);
    }
  }, [curso]);

  // Função para adicionar comentário
  const handleAdicionarComentario = () => {
    if (!novoComentario.trim() || !curso) return;

    const comentario = {
      id: Date.now(),
      usuario: user.email,
      texto: novoComentario,
      data: new Date().toISOString(),
      respostas: [],
    };

    const cursoAtualizado = {
      ...curso,
      comentarios: [...(curso.comentarios || []), comentario],
    };

    setCurso(cursoAtualizado);
    setNovoComentario("");

    // Atualizar no localStorage
    const savedCursos = localStorage.getItem("cursos");
    if (savedCursos) {
      const parsedCursos = JSON.parse(savedCursos);
      const updatedCursos = parsedCursos.map((c: Curso) =>
        c.id === curso.id ? cursoAtualizado : c
      );
      localStorage.setItem("cursos", JSON.stringify(updatedCursos));
    }
  };

  // Função para responder comentário
  const handleResponderComentario = (comentarioId: number) => {
    if (!respostaComentario.trim() || !curso) return;

    const resposta = {
      id: Date.now(),
      usuario: user.email,
      texto: respostaComentario,
      data: new Date().toISOString(),
    };

    const cursoAtualizado = {
      ...curso,
      comentarios: curso.comentarios?.map((c) =>
        c.id === comentarioId
          ? { ...c, respostas: [...(c.respostas || []), resposta] }
          : c
      ),
    };

    setCurso(cursoAtualizado);
    setRespostaComentario("");
    setComentarioRespondido(null);

    // Atualizar no localStorage
    const savedCursos = localStorage.getItem("cursos");
    if (savedCursos) {
      const parsedCursos = JSON.parse(savedCursos);
      const updatedCursos = parsedCursos.map((c: Curso) =>
        c.id === curso.id ? cursoAtualizado : c
      );
      localStorage.setItem("cursos", JSON.stringify(updatedCursos));
    }
  };

  // Função para formatar data
  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  if (!user || !curso) {
    return null;
  }

  return (
    <AppLayoutWithoutSidebar user={user}>
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold">{curso.titulo}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna principal com vídeo e informações */}
          <div className="lg:col-span-2 space-y-6">
            {/* Player de vídeo */}
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              {curso.videoUrl ? (
                <iframe
                  src={curso.videoUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  <p>Vídeo não disponível</p>
                </div>
              )}
            </div>

            {/* Informações do curso */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
                    <Users className="h-5 w-5 mr-2" />
                    <span className="font-medium">{curso.inscritos.length} inscritos</span>
                  </div>
                  <div className="flex items-center text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
                    <Clock className="h-5 w-5 mr-2" />
                    <span className="font-medium">{tempoAssistido} minutos assistidos</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {user.email.startsWith("admin@brasfi.com") && (
                    <Button
                      variant="outline"
                      onClick={() => router.push(`/app/courses/${curso.id}/admin`)}
                      className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200 hover:border-blue-300 transition-colors"
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Gerenciar Curso
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <ThumbsUp className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <Bookmark className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Sobre este curso</h2>
                <p className="text-gray-600">{curso.descricao}</p>
              </div>
            </Card>

            {/* Materiais do curso */}
            {curso.materiais && curso.materiais.length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Materiais do curso</h2>
                <div className="space-y-4">
                  {curso.materiais.map((material) => (
                    <div
                      key={material.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {material.tipo === "pdf" ? (
                          <FileText className="h-6 w-6 text-red-500" />
                        ) : material.tipo === "link" ? (
                          <BookOpen className="h-6 w-6 text-blue-500" />
                        ) : (
                          <FileText className="h-6 w-6 text-green-500" />
                        )}
                        <span className="font-medium">{material.titulo}</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Baixar
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Seção de comentários */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Comentários</h2>
              <div className="space-y-4">
                {/* Formulário de novo comentário */}
                <div className="space-y-2">
                  <Textarea
                    placeholder="Adicione um comentário..."
                    value={novoComentario}
                    onChange={(e) => setNovoComentario(e.target.value)}
                    rows={3}
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={handleAdicionarComentario}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 transition-colors"
                    >
                      Comentar
                    </Button>
                  </div>
                </div>

                {/* Lista de comentários */}
                {curso.comentarios?.map((comentario) => (
                  <div key={comentario.id} className="border-b pb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {comentario.usuario[0].toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{comentario.usuario}</span>
                          <span className="text-sm text-gray-500">
                            {formatarData(comentario.data)}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-2">{comentario.texto}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setComentarioRespondido(comentario.id)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          Responder
                        </Button>

                        {/* Formulário de resposta */}
                        {comentarioRespondido === comentario.id && (
                          <div className="mt-2 space-y-2">
                            <Textarea
                              placeholder="Escreva sua resposta..."
                              value={respostaComentario}
                              onChange={(e) => setRespostaComentario(e.target.value)}
                              rows={2}
                              className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            />
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setComentarioRespondido(null)}
                                className="border-gray-200 hover:border-gray-300"
                              >
                                Cancelar
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleResponderComentario(comentario.id)}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                Responder
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Lista de respostas */}
                        {comentario.respostas && comentario.respostas.length > 0 && (
                          <div className="mt-4 space-y-4">
                            {comentario.respostas.map((resposta) => (
                              <div
                                key={resposta.id}
                                className="ml-8 border-l-2 border-blue-100 pl-4"
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-blue-600">
                                    {resposta.usuario}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    {formatarData(resposta.data)}
                                  </span>
                                </div>
                                <p className="text-gray-700">{resposta.texto}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Coluna lateral com progresso e informações adicionais */}
          <div className="space-y-6">
            {/* Progresso do curso */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Seu Progresso</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Tempo assistido</span>
                    <span>{tempoAssistido} minutos</span>
                  </div>
                  <Progress value={(tempoAssistido / 60) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Materiais baixados</span>
                    <span>0 de {curso.materiais?.length || 0}</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>
              </div>
            </Card>

            {/* Informações adicionais */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Informações</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  <span>{curso.comentarios?.length || 0} comentários</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span>{curso.inscritos.length} alunos inscritos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span>Última atualização: {formatarData(new Date().toISOString())}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppLayoutWithoutSidebar>
  );
} 