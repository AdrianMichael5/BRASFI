"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppNavbar } from "@/components/app-navbar";
import { NavigationSidebar } from "@/components/navigation-sidebar";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Plus,
  Trash,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Evento {
  id: number;
  titulo: string;
  data: string;
  horarioInicio: string;
  horarioFim: string;
  local: string;
  participantes: number;
  descricao: string;
  categoria: string;
}

// Eventos de exemplo
const eventosIniciais: Evento[] = [
  {
    id: 1,
    titulo: "Workshop de Sustentabilidade",
    data: "2023-06-15",
    horarioInicio: "14:00",
    horarioFim: "17:00",
    local: "Centro de Convenções BRASFI",
    participantes: 45,
    descricao:
      "Aprenda práticas sustentáveis para implementar em sua comunidade e empresa.",
    categoria: "workshop",
  },
  {
    id: 2,
    titulo: "Conferência Anual de Meio Ambiente",
    data: "2023-07-22",
    horarioInicio: "09:00",
    horarioFim: "18:00",
    local: "Auditório Principal",
    participantes: 120,
    descricao:
      "Discussões sobre políticas ambientais e apresentação de projetos inovadores.",
    categoria: "conferencia",
  },
  {
    id: 3,
    titulo: "Curso de Educação Ambiental para Educadores",
    data: "2023-08-05",
    horarioInicio: "09:00",
    horarioFim: "16:00",
    local: "Sala de Treinamento BRASFI",
    participantes: 30,
    descricao:
      "Capacitação para professores sobre como integrar educação ambiental no currículo escolar.",
    categoria: "curso",
  },
];

export default function EventosPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Evento | null>(null);

  // Estado para o formulário de novo evento
  const [novoEvento, setNovoEvento] = useState<Omit<Evento, "id">>({
    titulo: "",
    data: "",
    horarioInicio: "",
    horarioFim: "",
    local: "",
    participantes: 0,
    descricao: "",
    categoria: "workshop",
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

  // Carregar eventos do localStorage ou usar os padrões
  useEffect(() => {
    const savedEventos = localStorage.getItem("eventos");
    if (savedEventos) {
      try {
        const parsedEventos = JSON.parse(savedEventos);

        // Verificar se os eventos têm o novo formato com horarioInicio e horarioFim
        const eventosAtualizados = parsedEventos.map((evento: any) => {
          if (evento.horario && !evento.horarioInicio) {
            // Converter formato antigo para novo
            const horarios = evento.horario.split(" - ");
            return {
              ...evento,
              horarioInicio: horarios[0] || "",
              horarioFim: horarios[1] || "",
            };
          }
          return evento;
        });

        setEventos(eventosAtualizados);
      } catch (e) {
        console.error("Erro ao carregar eventos:", e);
        setEventos(eventosIniciais);
      }
    } else {
      setEventos(eventosIniciais);
      localStorage.setItem("eventos", JSON.stringify(eventosIniciais));
    }
  }, []);

  // Função para lidar com mudanças no formulário
  const handleInputChange = (
    field: keyof Omit<Evento, "id">,
    value: string | number
  ) => {
    setNovoEvento({
      ...novoEvento,
      [field]: value,
    });
  };

  // Função para criar ou editar um evento
  const handleSaveEvento = () => {
    if (
      !novoEvento.titulo ||
      !novoEvento.data ||
      !novoEvento.horarioInicio ||
      !novoEvento.horarioFim ||
      !novoEvento.local
    ) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    let updatedEventos: Evento[];

    if (editingEvent) {
      // Editar evento existente
      updatedEventos = eventos.map((evento) =>
        evento.id === editingEvent.id
          ? { ...novoEvento, id: editingEvent.id }
          : evento
      );
    } else {
      // Criar novo evento
      const newId = Math.max(0, ...eventos.map((e) => e.id)) + 1;
      updatedEventos = [{ ...novoEvento, id: newId }, ...eventos];
    }

    setEventos(updatedEventos);
    localStorage.setItem("eventos", JSON.stringify(updatedEventos));

    // Resetar formulário e fechar diálogo
    setNovoEvento({
      titulo: "",
      data: "",
      horarioInicio: "",
      horarioFim: "",
      local: "",
      participantes: 0,
      descricao: "",
      categoria: "workshop",
    });
    setEditingEvent(null);
    setDialogOpen(false);
  };

  // Função para excluir um evento
  const handleDeleteEvento = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este evento?")) {
      const updatedEventos = eventos.filter((evento) => evento.id !== id);
      setEventos(updatedEventos);
      localStorage.setItem("eventos", JSON.stringify(updatedEventos));
    }
  };

  // Função para editar um evento
  const handleEditEvento = (evento: Evento) => {
    setEditingEvent(evento);
    setNovoEvento({
      titulo: evento.titulo,
      data: evento.data,
      horarioInicio: evento.horarioInicio,
      horarioFim: evento.horarioFim,
      local: evento.local,
      participantes: evento.participantes,
      descricao: evento.descricao,
      categoria: evento.categoria,
    });
    setDialogOpen(true);
  };

  // Função para formatar a data para exibição
  const formatarData = (dataISO: string) => {
    if (!dataISO) return "";

    try {
      const data = new Date(dataISO);
      return new Intl.DateTimeFormat("pt-BR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(data);
    } catch (e) {
      return dataISO;
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
          <div className="container mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Eventos</h1>
              {user.isAdmin && (
                <Button
                  onClick={() => {
                    setEditingEvent(null);
                    setNovoEvento({
                      titulo: "",
                      data: "",
                      horarioInicio: "",
                      horarioFim: "",
                      local: "",
                      participantes: 0,
                      descricao: "",
                      categoria: "workshop",
                    });
                    setDialogOpen(true);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Criar Evento
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventos.map((evento) => (
                <Card
                  key={evento.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
                >
                  <div className="h-3 bg-green-600"></div>
                  <div className="p-6">
                    <div className="flex justify-between">
                      <h2 className="text-xl font-semibold mb-2 text-green-700">
                        {evento.titulo}
                      </h2>
                      {user.isAdmin && (
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-blue-600"
                            onClick={() => handleEditEvento(evento)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600"
                            onClick={() => handleDeleteEvento(evento.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 text-green-600" />
                        <span>{formatarData(evento.data)}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2 text-green-600" />
                        <span>
                          {evento.horarioInicio} - {evento.horarioFim}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-green-600" />
                        <span>{evento.local}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-2 text-green-600" />
                        <span>{evento.participantes} participantes</span>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4">{evento.descricao}</p>

                    <div className="flex justify-between items-center">
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        {evento.categoria}
                      </span>
                      <Button className="bg-green-600 hover:bg-green-700 text-white cursor-pointer">
                        Inscrever-se
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Modal para criar/editar evento */}
            {dialogOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div
                  className="fixed inset-0 bg-black/50"
                  onClick={() => setDialogOpen(false)}
                ></div>
                <div className="relative z-50 w-full max-w-md md:max-w-xl bg-white rounded-lg shadow-xl p-6 mx-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">
                      {editingEvent ? "Editar Evento" : "Criar Novo Evento"}
                    </h2>
                    <Button
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="titulo">Título do Evento*</Label>
                        <Input
                          id="titulo"
                          value={novoEvento.titulo}
                          onChange={(e) =>
                            handleInputChange("titulo", e.target.value)
                          }
                          placeholder="Ex: Workshop de Sustentabilidade"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="categoria">Categoria*</Label>
                        <Select
                          value={novoEvento.categoria}
                          onValueChange={(value) =>
                            handleInputChange("categoria", value)
                          }
                        >
                          <SelectTrigger id="categoria">
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="workshop">Workshop</SelectItem>
                            <SelectItem value="conferencia">
                              Conferência
                            </SelectItem>
                            <SelectItem value="curso">Curso</SelectItem>
                            <SelectItem value="palestra">Palestra</SelectItem>
                            <SelectItem value="seminario">Seminário</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="data">Data*</Label>
                      <Input
                        id="data"
                        type="date"
                        value={novoEvento.data}
                        onChange={(e) =>
                          handleInputChange("data", e.target.value)
                        }
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="horarioInicio">
                          Horário de Início*
                        </Label>
                        <Input
                          id="horarioInicio"
                          type="time"
                          value={novoEvento.horarioInicio}
                          onChange={(e) =>
                            handleInputChange("horarioInicio", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="horarioFim">Horário de Término*</Label>
                        <Input
                          id="horarioFim"
                          type="time"
                          value={novoEvento.horarioFim}
                          onChange={(e) =>
                            handleInputChange("horarioFim", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="local">Local*</Label>
                        <Input
                          id="local"
                          value={novoEvento.local}
                          onChange={(e) =>
                            handleInputChange("local", e.target.value)
                          }
                          placeholder="Ex: Centro de Convenções BRASFI"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="participantes">
                          Limite de Participantes
                        </Label>
                        <Input
                          id="participantes"
                          type="number"
                          value={novoEvento.participantes.toString()}
                          onChange={(e) =>
                            handleInputChange(
                              "participantes",
                              Number.parseInt(e.target.value) || 0
                            )
                          }
                          placeholder="Ex: 50"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="descricao">Descrição</Label>
                      <Textarea
                        id="descricao"
                        value={novoEvento.descricao}
                        onChange={(e) =>
                          handleInputChange("descricao", e.target.value)
                        }
                        placeholder="Descreva o evento..."
                        rows={4}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => setDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleSaveEvento}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {editingEvent ? "Salvar Alterações" : "Criar Evento"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
