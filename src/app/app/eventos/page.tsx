"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/app-layout"
import { Calendar, Clock, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function EventosPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  // Verificar se o usuário está autenticado
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"
    const userData = localStorage.getItem("user")

    if (!isAuthenticated || !userData) {
      router.push("/auth/login")
    } else {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
      } catch (e) {
        console.error("Erro ao analisar dados do usuário:", e)
        localStorage.removeItem("isAuthenticated")
        localStorage.removeItem("user")
        router.push("/auth/login")
      }
    }

    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Eventos de exemplo
  const eventos = [
    {
      id: 1,
      titulo: "Workshop de Sustentabilidade",
      data: "15 de Junho, 2023",
      horario: "14:00 - 17:00",
      local: "Centro de Convenções BRASFI",
      participantes: 45,
      descricao: "Aprenda práticas sustentáveis para implementar em sua comunidade e empresa.",
      categoria: "workshop",
    },
    {
      id: 2,
      titulo: "Conferência Anual de Meio Ambiente",
      data: "22 de Julho, 2023",
      horario: "09:00 - 18:00",
      local: "Auditório Principal",
      participantes: 120,
      descricao: "Discussões sobre políticas ambientais e apresentação de projetos inovadores.",
      categoria: "conferencia",
    },
    {
      id: 3,
      titulo: "Curso de Educação Ambiental para Educadores",
      data: "5-7 de Agosto, 2023",
      horario: "09:00 - 16:00",
      local: "Sala de Treinamento BRASFI",
      participantes: 30,
      descricao: "Capacitação para professores sobre como integrar educação ambiental no currículo escolar.",
      categoria: "curso",
    },
  ]

  return (
    <AppLayout
      user={user}
      categories={[]}
      setCategories={() => {}}
      currentChannelId={null}
      setCurrentChannelId={() => {}}
    >
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Eventos</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventos.map((evento) => (
            <div key={evento.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <div className="h-3 bg-green-600"></div>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 text-green-700">{evento.titulo}</h2>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 text-green-600" />
                    <span>{evento.data}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-2 text-green-600" />
                    <span>{evento.horario}</span>
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
                  <Button className="bg-green-600 hover:bg-green-700 text-white">Inscrever-se</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
