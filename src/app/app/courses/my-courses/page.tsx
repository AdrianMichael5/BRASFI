"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppLayoutWithoutSidebar } from "@/components/app-layout-without-sidebar";
import {
  BookOpen,
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

export default function MyCoursesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [cursos, setCursos] = useState<Curso[]>([]);

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

  // Carregar cursos do localStorage
  useEffect(() => {
    const savedCursos = localStorage.getItem("cursos");
    if (savedCursos) {
      try {
        const parsedCursos = JSON.parse(savedCursos);
        // Filtrar apenas os cursos em que o usuário está inscrito
        const cursosInscritos = parsedCursos.filter((curso: Curso) =>
          curso.inscritos.includes(user?.email)
        );
        setCursos(cursosInscritos);
      } catch (e) {
        console.error("Erro ao carregar cursos:", e);
        setCursos([]);
      }
    }
  }, [user]);

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

  // Função para formatar valor em reais
  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
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

  if (!user) {
    return null;
  }

  return (
    <AppLayoutWithoutSidebar user={user}>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Meus Cursos</h1>
          <Button
            onClick={() => router.push("/app/courses")}
            variant="outline"
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            Todos os Cursos
          </Button>
        </div>

        {cursos.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-medium text-gray-600 mb-2">
              Você não está inscrito em nenhum curso
            </h2>
            <p className="text-gray-500">
              Explore os cursos disponíveis e faça sua inscrição para começar a
              aprender.
            </p>
            <Button
              onClick={() => router.push("/app/courses")}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Ver Todos os Cursos
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cursos.map((curso) => (
              <Card
                key={curso.id}
                className="overflow-hidden flex flex-col border-gray-200"
              >
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

                      <Button
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => router.push(`/app/courses/${curso.id}`)}
                      >
                        <Award className="h-4 w-4 mr-2" />
                        Entrar
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayoutWithoutSidebar>
  );
}
