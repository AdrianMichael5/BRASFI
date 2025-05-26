"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppLayoutWithoutSidebar } from "@/components/app-layout-without-sidebar";
import {
  BookOpen,
  Plus,
  Edit,
  Trash,
  Users,
  DollarSign,
  Award,
  RefreshCw,
  Leaf,
  Globe,
  Lightbulb,
  Rocket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";

interface Curso {
  id: number;
  titulo: string;
  descricao: string;
  icone: string;
  metaArrecadacao: number;
  valorArrecadado: number;
  inscritos: string[];
}

// Cursos de exemplo
const cursosIniciais: Curso[] = [
  {
    id: 1,
    titulo: "Finanças Sustentáveis",
    descricao:
      "Aprenda como integrar práticas sustentáveis em decisões financeiras e investimentos responsáveis.",
    icone: "banknote",
    metaArrecadacao: 5000,
    valorArrecadado: 2500,
    inscritos: ["usuario@exemplo.com"],
  },
  {
    id: 2,
    titulo: "Liderança Ambiental",
    descricao:
      "Desenvolva habilidades de liderança focadas em sustentabilidade e gestão ambiental.",
    icone: "users",
    metaArrecadacao: 3000,
    valorArrecadado: 1200,
    inscritos: [],
  },
  {
    id: 3,
    titulo: "Economia Circular",
    descricao:
      "Entenda os princípios da economia circular e como implementá-los em diferentes setores.",
    icone: "recycle",
    metaArrecadacao: 4000,
    valorArrecadado: 3200,
    inscritos: [],
  },
];

export default function CoursesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cursoDetalhesOpen, setCursoDetalhesOpen] = useState(false);
  const [doacaoModalOpen, setDoacaoModalOpen] = useState(false);
  const [editingCurso, setEditingCurso] = useState<Curso | null>(null);
  const [cursoSelecionado, setCursoSelecionado] = useState<Curso | null>(null);
  const [valorDoacao, setValorDoacao] = useState<string>("50");
  const [pixGerado, setPixGerado] = useState(false);

  // Estado para o formulário de novo curso
  const [novoCurso, setNovoCurso] = useState<
    Omit<Curso, "id" | "inscritos" | "valorArrecadado">
  >({
    titulo: "",
    descricao: "",
    icone: "bookOpen",
    metaArrecadacao: 1000,
  });

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

  // Carregar cursos do localStorage ou usar os padrões
  useEffect(() => {
    const savedCursos = localStorage.getItem("cursos");
    if (savedCursos) {
      try {
        const parsedCursos = JSON.parse(savedCursos);
        setCursos(parsedCursos);
      } catch (e) {
        console.error("Erro ao carregar cursos:", e);
        setCursos(cursosIniciais);
      }
    } else {
      setCursos(cursosIniciais);
      localStorage.setItem("cursos", JSON.stringify(cursosIniciais));
    }
  }, []);

  // Função para renderizar ícones
  const renderIcone = (icone: string, className = "h-6 w-6") => {
    switch (icone) {
      case "bookOpen":
        return <BookOpen className={className} />;
      case "banknote":
        return <DollarSign className={className} />;
      case "users":
        return <Users className={className} />;
      case "recycle":
        return <RefreshCw className={className} />;
      case "leaf":
        return <Leaf className={className} />;
      case "globe":
        return <Globe className={className} />;
      case "lightbulb":
        return <Lightbulb className={className} />;
      case "rocket":
        return <Rocket className={className} />;
      default:
        return <BookOpen className={className} />;
    }
  };

  // Função para lidar com mudanças no formulário
  const handleInputChange = (
    field: keyof Omit<Curso, "id" | "inscritos" | "valorArrecadado">,
    value: string | number
  ) => {
    setNovoCurso({
      ...novoCurso,
      [field]: value,
    });
  };

  // Função para criar ou editar um curso
  const handleSaveCurso = () => {
    if (!novoCurso.titulo || !novoCurso.descricao) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    let updatedCursos: Curso[];

    if (editingCurso) {
      // Editar curso existente
      updatedCursos = cursos.map((curso) =>
        curso.id === editingCurso.id
          ? {
              ...curso,
              titulo: novoCurso.titulo,
              descricao: novoCurso.descricao,
              icone: novoCurso.icone,
              metaArrecadacao: novoCurso.metaArrecadacao,
            }
          : curso
      );
    } else {
      // Criar novo curso
      const newId = Math.max(0, ...cursos.map((c) => c.id)) + 1;
      updatedCursos = [
        ...cursos,
        {
          ...novoCurso,
          id: newId,
          valorArrecadado: 0,
          inscritos: [],
        },
      ];
    }

    setCursos(updatedCursos);
    localStorage.setItem("cursos", JSON.stringify(updatedCursos));

    // Resetar formulário e fechar diálogo
    setNovoCurso({
      titulo: "",
      descricao: "",
      icone: "bookOpen",
      metaArrecadacao: 1000,
    });
    setEditingCurso(null);
    setDialogOpen(false);
  };

  // Função para excluir um curso
  const handleDeleteCurso = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este curso?")) {
      const updatedCursos = cursos.filter((curso) => curso.id !== id);
      setCursos(updatedCursos);
      localStorage.setItem("cursos", JSON.stringify(updatedCursos));
    }
  };

  // Função para editar um curso
  const handleEditCurso = (curso: Curso) => {
    setEditingCurso(curso);
    setNovoCurso({
      titulo: curso.titulo,
      descricao: curso.descricao,
      icone: curso.icone,
      metaArrecadacao: curso.metaArrecadacao,
    });
    setDialogOpen(true);
  };

  // Função para abrir detalhes do curso
  const handleOpenCursoDetalhes = (curso: Curso) => {
    if (isInscrito(curso)) {
      router.push(`/app/courses/my-courses/${curso.id}`);
    } else {
      setCursoSelecionado(curso);
      setCursoDetalhesOpen(true);
    }
  };

  // Função para inscrever-se em um curso
  const handleInscreverCurso = (curso: Curso) => {
    if (!user || !user.email) return;

    // Verificar se o usuário já está inscrito
    if (curso.inscritos.includes(user.email)) {
      alert("Você já está inscrito neste curso.");
      return;
    }

    // Adicionar usuário à lista de inscritos
    const updatedCursos = cursos.map((c) => {
      if (c.id === curso.id) {
        return {
          ...c,
          inscritos: [...c.inscritos, user.email],
        };
      }
      return c;
    });

    setCursos(updatedCursos);
    localStorage.setItem("cursos", JSON.stringify(updatedCursos));

    // Atualizar o curso selecionado se estiver aberto
    if (cursoSelecionado && cursoSelecionado.id === curso.id) {
      setCursoSelecionado({
        ...cursoSelecionado,
        inscritos: [...cursoSelecionado.inscritos, user.email],
      });
    }

    alert("Inscrição realizada com sucesso!");
  };

  // Função para abrir modal de doação
  const handleOpenDoacaoModal = (curso: Curso) => {
    setCursoSelecionado(curso);
    setDoacaoModalOpen(true);
    setPixGerado(false);
  };

  // Função para processar doação
  const handleProcessarDoacao = () => {
    if (!cursoSelecionado || !valorDoacao) return;

    const valor = Number.parseFloat(valorDoacao);
    if (isNaN(valor) || valor <= 0) {
      alert("Por favor, informe um valor válido para doação.");
      return;
    }

    // Simular geração de PIX
    setPixGerado(true);
  };

  // Função para confirmar doação (após pagamento do PIX)
  const handleConfirmarDoacao = () => {
    if (!cursoSelecionado || !valorDoacao) return;

    const valor = Number.parseFloat(valorDoacao);
    if (isNaN(valor) || valor <= 0) return;

    // Atualizar valor arrecadado
    const updatedCursos = cursos.map((c) => {
      if (c.id === cursoSelecionado.id) {
        return {
          ...c,
          valorArrecadado: c.valorArrecadado + valor,
        };
      }
      return c;
    });

    setCursos(updatedCursos);
    localStorage.setItem("cursos", JSON.stringify(updatedCursos));

    // Fechar modal e resetar estados
    setDoacaoModalOpen(false);
    setPixGerado(false);
    setValorDoacao("50");

    alert("Doação processada com sucesso! Obrigado pela sua contribuição.");
  };

  // Função para formatar valor em reais
  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  // Verificar se o usuário está inscrito em um curso
  const isInscrito = (curso: Curso) => {
    return user && user.email && curso.inscritos.includes(user.email);
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
    <AppLayoutWithoutSidebar user={user}>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Cursos</h1>
          <div className="flex gap-4">
            <Button
              onClick={() => router.push('/app/courses/my-courses')}
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              Meus Cursos
            </Button>
            {user.isAdmin && (
              <Button
                onClick={() => {
                  setEditingCurso(null);
                  setNovoCurso({
                    titulo: "",
                    descricao: "",
                    icone: "bookOpen",
                    metaArrecadacao: 1000,
                  });
                  setDialogOpen(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Criar Curso
              </Button>
            )}
          </div>
        </div>

        {cursos.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-medium text-gray-600 mb-2">
              Nenhum curso disponível
            </h2>
            <p className="text-gray-500">
              {user.isAdmin
                ? "Clique no botão 'Criar Curso' para adicionar um novo curso."
                : "Novos cursos serão adicionados em breve."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cursos.map((curso) => (
              <Card key={curso.id} className="overflow-hidden flex flex-col border-gray-200">
                <div className="h-3 bg-blue-600"></div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      {renderIcone(curso.icone, "h-6 w-6 text-blue-500")}
                    </div>
                    <h3 className="text-xl font-semibold">{curso.titulo}</h3>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {curso.descricao}
                  </p>

                  <div className="mt-auto space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>
                          Arrecadado: {formatarMoeda(curso.valorArrecadado)}
                        </span>
                        <span>
                          Meta: {formatarMoeda(curso.metaArrecadacao)}
                        </span>
                      </div>
                      <Progress
                        value={
                          (curso.valorArrecadado / curso.metaArrecadacao) * 100
                        }
                        className="h-2"
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm text-blue-500">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{curso.inscritos.length} inscritos</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100"
                          onClick={() => handleOpenDoacaoModal(curso)}
                        >
                          <DollarSign className="h-5 w-5" />
                        </Button>

                        {!isInscrito(curso) ? (
                          <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => handleInscreverCurso(curso)}
                          >
                            <Users className="h-4 w-4 mr-2" />
                            Inscrever-se
                          </Button>
                        ) : (
                          <Button
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => router.push(`/app/courses/my-courses/${curso.id}`)}
                          >
                            <Award className="h-4 w-4 mr-2" />
                            Entrar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Modal para criar/editar curso */}
        {dialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => setDialogOpen(false)}
            ></div>
            <div className="relative z-50 w-full max-w-md md:max-w-xl bg-white rounded-lg shadow-xl p-6 mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {editingCurso ? "Editar Curso" : "Criar Novo Curso"}
                </h2>
                <Button
                  className="cursor-pointer"
                  variant="ghost"
                  size="icon"
                  onClick={() => setDialogOpen(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </Button>
              </div>

              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título do Curso*</Label>
                  <Input
                    id="titulo"
                    value={novoCurso.titulo}
                    onChange={(e) =>
                      handleInputChange("titulo", e.target.value)
                    }
                    placeholder="Ex: Finanças Sustentáveis"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição*</Label>
                  <Textarea
                    id="descricao"
                    value={novoCurso.descricao}
                    onChange={(e) =>
                      handleInputChange("descricao", e.target.value)
                    }
                    placeholder="Descreva o curso..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="icone">Ícone do Curso*</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      "bookOpen",
                      "banknote",
                      "users",
                      "recycle",
                      "leaf",
                      "globe",
                      "lightbulb",
                      "rocket",
                    ].map((icone) => (
                      <Button
                        key={icone}
                        type="button"
                        variant={
                          novoCurso.icone === icone ? "default" : "outline"
                        }
                        className={`flex items-center justify-center p-3 h-auto cursor-pointer hover:bg-blue-100 ${
                          novoCurso.icone === icone
                            ? "bg-blue-600 text-white"
                            : "text-gray-700"
                        }`}
                        onClick={() => handleInputChange("icone", icone)}
                      >
                        {renderIcone(icone)}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaArrecadacao">
                    Meta de Arrecadação (R$)*
                  </Label>
                  <Input
                    id="metaArrecadacao"
                    type="number"
                    min="0"
                    step="100"
                    value={novoCurso.metaArrecadacao}
                    onChange={(e) =>
                      handleInputChange(
                        "metaArrecadacao",
                        Number(e.target.value)
                      )
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button className="cursor-pointer" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleSaveCurso}
                  className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                >
                  {editingCurso ? "Salvar Alterações" : "Criar Curso"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de detalhes do curso */}
        {cursoDetalhesOpen && cursoSelecionado && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => setCursoDetalhesOpen(false)}
            ></div>
            <div className="relative z-50 w-full max-w-md md:max-w-2xl bg-white rounded-lg shadow-xl p-6 mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{cursoSelecionado.titulo}</h2>
                <Button
                  className="cursor-pointer"
                  variant="ghost"
                  size="icon"
                  onClick={() => setCursoDetalhesOpen(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </Button>
              </div>

              <div className="mb-6 flex justify-center">
                <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center">
                  {renderIcone(
                    cursoSelecionado.icone,
                    "h-12 w-12 text-blue-500"
                  )}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Descrição</h3>
                <p className="text-gray-700">{cursoSelecionado.descricao}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">
                  Progresso de Arrecadação
                </h3>
                <div className="flex justify-between text-sm mb-1">
                  <span>
                    Arrecadado:{" "}
                    {formatarMoeda(cursoSelecionado.valorArrecadado)}
                  </span>
                  <span>
                    Meta: {formatarMoeda(cursoSelecionado.metaArrecadacao)}
                  </span>
                </div>
                <Progress
                  value={
                    (cursoSelecionado.valorArrecadado /
                      cursoSelecionado.metaArrecadacao) *
                    100
                  }
                  className="h-3 mb-4"
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-blue-600" />
                    <span>{cursoSelecionado.inscritos.length} inscritos</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100"
                      onClick={() => handleOpenDoacaoModal(cursoSelecionado)}
                    >
                      <DollarSign className="h-5 w-5" />
                    </Button>

                    {!isInscrito(cursoSelecionado) ? (
                      <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => handleInscreverCurso(cursoSelecionado)}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Inscrever-se
                      </Button>
                    ) : (
                      <Button
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => router.push(`/app/courses/my-courses/${cursoSelecionado.id}`)}
                      >
                        <Award className="h-4 w-4 mr-2" />
                        Entrar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de doação */}
        {doacaoModalOpen && cursoSelecionado && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => !pixGerado && setDoacaoModalOpen(false)}
            ></div>
            <div className="relative z-50 w-full max-w-md bg-white rounded-lg shadow-xl p-6 mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Fazer Doação</h2>
                {!pixGerado && (
                  <Button
                    className="cursor-pointer"
                    variant="ghost"
                    size="icon"
                    onClick={() => setDoacaoModalOpen(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </Button>
                )}
              </div>

              {!pixGerado ? (
                <>
                  <p className="mb-4">
                    Você está fazendo uma doação para o curso{" "}
                    <strong>{cursoSelecionado.titulo}</strong>.
                  </p>

                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="valorDoacao">Valor da Doação (R$)</Label>
                      <Input
                        id="valorDoacao"
                        type="number"
                        min="5"
                        step="5"
                        value={valorDoacao}
                        onChange={(e) => setValorDoacao(e.target.value)}
                      />
                    </div>

                    <div className="flex gap-2 justify-center">
                      <Button
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 cursor-pointer"
                        onClick={() => setValorDoacao("50")}
                      >
                        R$ 50
                      </Button>
                      <Button
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 cursor-pointer"
                        onClick={() => setValorDoacao("100")}
                      >
                        R$ 100
                      </Button>
                      <Button
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 cursor-pointer"
                        onClick={() => setValorDoacao("200")}
                      >
                        R$ 200
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => setDoacaoModalOpen(false)}
                      className="cursor-pointer"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleProcessarDoacao}
                      className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                    >
                      Gerar PIX
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center py-4">
                    <div className="bg-gray-100 p-4 rounded-lg mb-4">
                      <div className="w-48 h-48 mx-auto bg-white p-2 rounded-lg mb-2">
                        <div className="w-full h-full border-2 border-gray-300 rounded flex items-center justify-center">
                          <img
                            src="/placeholder.svg?height=150&width=150&text=QR+Code+PIX"
                            alt="QR Code PIX"
                            className="w-36 h-36"
                          />
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Escaneie o QR Code com seu aplicativo de banco
                      </p>
                      <div className="bg-gray-200 p-2 rounded text-center">
                        <p className="text-xs text-gray-600 mb-1">Código PIX</p>
                        <p className="text-sm font-mono select-all">
                          00020126580014BR.GOV.BCB.PIX0136a629534e-7693-46c9-99a8-5f35d88bc07752040000530398654041.005802BR5925BRASFI
                          EDUCACAO AMBIENTAL6009SAO PAULO62070503***6304E2CA
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="font-semibold text-lg">
                        Valor: {formatarMoeda(Number.parseFloat(valorDoacao))}
                      </p>
                      <p className="text-gray-600">
                        Destinatário: BRASFI EDUCACAO AMBIENTAL
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                        onClick={handleConfirmarDoacao}
                      >
                        Confirmar Pagamento
                      </Button>
                      <Button
                        className="cursor-pointer"
                        variant="outline"
                        onClick={() => {
                          setPixGerado(false);
                          setDoacaoModalOpen(false);
                        }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </AppLayoutWithoutSidebar>
  );
} 