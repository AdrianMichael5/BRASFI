"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppLayoutWithoutSidebar } from "@/components/app-layout-without-sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Video, Users, Clock, Save, Plus } from "lucide-react";

interface Curso {
  id: number;
  titulo: string;
  descricao: string;
  icone: string;
  metaArrecadacao: number;
  valorArrecadado: number;
  inscritos: string[];
  videoUrl?: string;
  aulas?: {
    id: number;
    titulo: string;
    videoUrl: string;
    duracao: number;
    ordem: number;
    visualizacoes: number;
  }[];
}

export default function AdminCursoPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [curso, setCurso] = useState<Curso | null>(null);
  const [novaAula, setNovaAula] = useState({
    titulo: "",
    videoUrl: "",
    duracao: 0,
  });
  const [editando, setEditando] = useState(false);

  // Verificar se o usuário está autenticado e é admin
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const userData = localStorage.getItem("user");

    if (!isAuthenticated || !userData) {
      router.push("/auth/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      // Verifica se o email começa com admin@brasfi.com
      if (!parsedUser.email.startsWith("admin@brasfi.com")) {
        router.push("/app/courses");
        return;
      }
      setUser(parsedUser);
    } catch (e) {
      console.error("Erro ao analisar dados do usuário:", e);
      router.push("/auth/login");
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

  const handleAdicionarAula = () => {
    if (!curso || !novaAula.titulo || !novaAula.videoUrl) return;

    const novaAulaCompleta = {
      id: Date.now(),
      ...novaAula,
      ordem: (curso.aulas?.length || 0) + 1,
      visualizacoes: 0,
    };

    const cursoAtualizado = {
      ...curso,
      aulas: [...(curso.aulas || []), novaAulaCompleta],
    };

    setCurso(cursoAtualizado);
    setNovaAula({ titulo: "", videoUrl: "", duracao: 0 });

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

  const handleReordenarAulas = (aulaId: number, direcao: "up" | "down") => {
    if (!curso || !curso.aulas) return;

    const aulas = [...curso.aulas];
    const index = aulas.findIndex((a) => a.id === aulaId);
    if (index === -1) return;

    if (direcao === "up" && index > 0) {
      [aulas[index - 1], aulas[index]] = [aulas[index], aulas[index - 1]];
    } else if (direcao === "down" && index < aulas.length - 1) {
      [aulas[index], aulas[index + 1]] = [aulas[index + 1], aulas[index]];
    }

    // Atualizar ordem
    const aulasAtualizadas = aulas.map((aula, idx) => ({
      ...aula,
      ordem: idx + 1,
    }));

    const cursoAtualizado = {
      ...curso,
      aulas: aulasAtualizadas,
    };

    setCurso(cursoAtualizado);

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

  const formatarDuracao = (minutos: number) => {
    const horas = Math.floor(minutos / 60);
    const minutosRestantes = minutos % 60;
    return `${horas}h ${minutosRestantes}min`;
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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl font-bold">
              Gerenciar Curso: {curso.titulo}
            </h1>
          </div>
          <Button
            onClick={() => setEditando(!editando)}
            variant={editando ? "destructive" : "default"}
            className={
              editando
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
            }
          >
            {editando ? "Cancelar Edição" : "Editar Curso"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informações do curso */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                Informações do Curso
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Título do Curso
                  </label>
                  <Input
                    value={curso.titulo}
                    disabled={!editando}
                    onChange={(e) =>
                      setCurso({ ...curso, titulo: e.target.value })
                    }
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Descrição
                  </label>
                  <Textarea
                    value={curso.descricao}
                    disabled={!editando}
                    onChange={(e) =>
                      setCurso({ ...curso, descricao: e.target.value })
                    }
                    rows={4}
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                {editando && (
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                    onClick={() => setEditando(false)}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Alterações
                  </Button>
                )}
              </div>
            </Card>

            {/* Lista de aulas */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Aulas do Curso</h2>
                <Button
                  onClick={() => setEditando(!editando)}
                  className="bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Aula
                </Button>
              </div>

              {/* Formulário de nova aula */}
              {editando && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Título da Aula
                    </label>
                    <Input
                      value={novaAula.titulo}
                      onChange={(e) =>
                        setNovaAula({ ...novaAula, titulo: e.target.value })
                      }
                      placeholder="Digite o título da aula"
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      URL do Vídeo (YouTube)
                    </label>
                    <Input
                      value={novaAula.videoUrl}
                      onChange={(e) =>
                        setNovaAula({ ...novaAula, videoUrl: e.target.value })
                      }
                      placeholder="Cole a URL do vídeo do YouTube"
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Duração (minutos)
                    </label>
                    <Input
                      type="number"
                      value={novaAula.duracao}
                      onChange={(e) =>
                        setNovaAula({
                          ...novaAula,
                          duracao: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="Digite a duração em minutos"
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                    onClick={handleAdicionarAula}
                    disabled={!novaAula.titulo || !novaAula.videoUrl}
                  >
                    Adicionar Aula
                  </Button>
                </div>
              )}

              <div className="space-y-4">
                {curso.aulas?.map((aula) => (
                  <div
                    key={aula.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <Video className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">
                          {aula.ordem}. {aula.titulo}
                        </h3>
                        <div className="text-sm text-gray-500 space-x-4">
                          <span>{formatarDuracao(aula.duracao)}</span>
                          <span>•</span>
                          <span>{aula.visualizacoes} visualizações</span>
                        </div>
                      </div>
                    </div>
                    {editando && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReordenarAulas(aula.id, "up")}
                          disabled={aula.ordem === 1}
                          className="hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          ↑
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReordenarAulas(aula.id, "down")}
                          disabled={aula.ordem === curso.aulas?.length}
                          className="hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          ↓
                        </Button>
                      </div>
                    )}
                  </div>
                ))}

                {(!curso.aulas || curso.aulas.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    Nenhuma aula cadastrada ainda.
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Coluna lateral */}
          <div className="space-y-6">
            {/* Estatísticas */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Estatísticas</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-blue-600" />
                  <span>
                    {curso.aulas?.length || 0} aula
                    {curso.aulas?.length !== 1 && "s"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span>{curso.inscritos.length} alunos inscritos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span>
                    {formatarDuracao(
                      curso.aulas?.reduce(
                        (acc, aula) => acc + aula.duracao,
                        0
                      ) || 0
                    )}{" "}
                    de conteúdo
                  </span>
                </div>
              </div>
            </Card>

            {/* Dicas */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Dicas</h2>
              <div className="space-y-3 text-sm text-gray-600">
                <p>• Mantenha as aulas com duração entre 5 e 15 minutos</p>
                <p>• Use títulos descritivos e objetivos</p>
                <p>• Organize as aulas em uma sequência lógica</p>
                <p>• Verifique se os links dos vídeos estão funcionando</p>
                <p>• Atualize o conteúdo regularmente</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppLayoutWithoutSidebar>
  );
}
