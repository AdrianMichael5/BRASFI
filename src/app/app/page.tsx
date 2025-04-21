"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/app-layout"
import { ChannelFeed } from "@/components/channel-feed"
import { WelcomeScreen } from "@/components/welcome-screen"

// Estrutura de dados para categorias e canais
interface Channel {
  id: string
  name: string
  description?: string
  isAnnouncement?: boolean
}

interface Category {
  id: string
  name: string
  channels: Channel[]
}

// Dados iniciais para categorias e canais
const defaultCategories: Category[] = [
  {
    id: "project",
    name: "PROJETO",
    channels: [
      {
        id: "design-project",
        name: "design project",
        description: "Este canal é para discussão de projetos de design.",
      },
      { id: "front-end-project", name: "front end project" },
      { id: "back-end-project", name: "back end project" },
      { id: "saas-project", name: "saas project" },
      { id: "landing-page-project", name: "landing page project" },
      { id: "booking-hotel-app", name: "booking hotel app" },
    ],
  },
  {
    id: "information",
    name: "INFORMAÇÃO",
    channels: [
      { id: "general", name: "general" },
      { id: "discussion", name: "discussion" },
      { id: "work-report", name: "work report" },
      { id: "announcement", name: "announcement", isAnnouncement: true },
    ],
  },
]

export default function AppPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [categories, setCategories] = useState(defaultCategories)
  const [currentChannelId, setCurrentChannelId] = useState<string | null>(null)
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null)

  // Verificar se o usuário está autenticado
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"
    const userData = localStorage.getItem("user")

    if (!isAuthenticated || !userData) {
      // Redirecionar para a página de login se não estiver autenticado
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

  // Recuperar categorias e canais do localStorage se existirem
  useEffect(() => {
    const savedCategories = localStorage.getItem("categories")
    if (savedCategories) {
      try {
        const parsedCategories = JSON.parse(savedCategories)
        setCategories(parsedCategories)
      } catch (e) {
        console.error("Erro ao carregar categorias:", e)
      }
    } else {
      // Se não existirem, salvar os padrões
      localStorage.setItem("categories", JSON.stringify(defaultCategories))
    }
  }, [])

  // Atualizar o canal atual quando o ID mudar
  useEffect(() => {
    if (currentChannelId) {
      for (const category of categories) {
        const channel = category.channels.find((c) => c.id === currentChannelId)
        if (channel) {
          setCurrentChannel(channel)
          return
        }
      }
      setCurrentChannel(null)
    } else {
      setCurrentChannel(null)
    }
  }, [currentChannelId, categories])

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

  return (
    <AppLayout
      user={user}
      categories={categories}
      setCategories={setCategories}
      currentChannelId={currentChannelId}
      setCurrentChannelId={setCurrentChannelId}
    >
      {currentChannel ? <ChannelFeed channel={currentChannel} /> : <WelcomeScreen />}
    </AppLayout>
  )
}
