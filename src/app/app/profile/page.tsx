"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { AppNavbar } from "@/components/app-navbar";
import { getInitials, getRandomColor } from "@/lib/utils";
import { NavigationSidebar } from "@/components/navigation-sidebar";

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  isAdmin: boolean;
  language?: string;
  dateFormat?: string;
  timeFormat?: string;
  country?: string;
  timeZone?: string;
  welcomeMessage?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<UserProfile | null>(null);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const userData = localStorage.getItem("user");

    if (!isAuthenticated || !userData) {
      router.push("/auth/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      // Adicionar valores padrão para os novos campos
      const userWithDefaults = {
        ...parsedUser,
        language: parsedUser.language || "Português",
        dateFormat: parsedUser.dateFormat || "DD/MM/YYYY",
        timeFormat: parsedUser.timeFormat || "24h",
        country: parsedUser.country || "Brasil",
        timeZone: parsedUser.timeZone || "America/Sao_Paulo",
        welcomeMessage:
          parsedUser.welcomeMessage || "Bem-vindo à plataforma BRASFI!",
      };
      setUser(userWithDefaults);
      setFormData(userWithDefaults);
    } catch (e) {
      console.error("Erro ao analisar dados do usuário:", e);
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("user");
      router.push("/auth/login");
    }

    setIsLoading(false);
  }, [router]);

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    if (!formData) return;
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSaveChanges = () => {
    if (!formData) return;
    setIsSaving(true);

    try {
      // Atualizar no localStorage
      localStorage.setItem("user", JSON.stringify(formData));
      setUser(formData);
      alert("Configurações salvas com sucesso!");
    } catch (e) {
      console.error("Erro ao salvar configurações:", e);
      alert("Erro ao salvar configurações. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita."
      )
    ) {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("user");
      router.push("/");
    }
  };

  if (isLoading || !user || !formData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  // Inicial do nome do usuário
  const userInitials = getInitials(user.name);
  // Cor de fundo para a bolinha
  const avatarColor = getRandomColor(user.email);

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <AppNavbar user={user} />
      <div className="flex flex-1 overflow-hidden">
        <NavigationSidebar />
        <div className="flex-1 overflow-auto">
          <div className="container max-w-4xl py-8 px-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Link href="/app">
                  <Button variant="ghost" size="icon" className="mr-2">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
                <h1 className="text-2xl font-bold">Detalhes da Conta</h1>
              </div>
            </div>
            <Card className="p-6 shadow-md">
              {/* Foto de perfil - Bolinha com inicial */}
              <div className="mb-8">
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 rounded-full overflow-hidden border border-gray-200">
                    <div
                      className="w-full h-full flex items-center justify-center text-white text-3xl font-bold"
                      style={{ backgroundColor: avatarColor }}
                    >
                      {userInitials}
                    </div>
                  </div>
                  <div className="text-3xl font-medium text-gray-800">
                    {user.name}
                    <div className="text-base text-gray-500">{user.email}</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Informações pessoais */}
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="language">Idioma</Label>
                  <Select
                    value={formData.language}
                    onValueChange={(value) =>
                      handleInputChange("language", value)
                    }
                  >
                    <SelectTrigger id="language" className="mt-1">
                      <SelectValue placeholder="Selecione um idioma" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-black">
                      <SelectItem value="Português">Português</SelectItem>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Español">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="dateFormat">Formato de Data</Label>
                  <Select
                    value={formData.dateFormat}
                    onValueChange={(value) =>
                      handleInputChange("dateFormat", value)
                    }
                  >
                    <SelectTrigger id="dateFormat" className="mt-1">
                      <SelectValue placeholder="Selecione um formato" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-black">
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="timeFormat">Formato de Hora</Label>
                  <Select
                    value={formData.timeFormat}
                    onValueChange={(value) =>
                      handleInputChange("timeFormat", value)
                    }
                  >
                    <SelectTrigger id="timeFormat" className="mt-1">
                      <SelectValue placeholder="Selecione um formato" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-black">
                      <SelectItem value="24h">24h</SelectItem>
                      <SelectItem value="12h">12h (AM/PM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="welcomeMessage">
                    Mensagem de Boas-vindas
                  </Label>
                  <Textarea
                    id="welcomeMessage"
                    value={formData.welcomeMessage}
                    onChange={(e) =>
                      handleInputChange("welcomeMessage", e.target.value)
                    }
                    className="mt-1 resize-none"
                    rows={3}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Esta mensagem será exibida para outros usuários no seu
                    perfil.
                  </p>
                </div>
              </div>
              <Separator className="my-8" />
              <div className="flex justify-between">
                <div className="flex gap-2">
                  <Button
                    className="border-2 text-white bg-blue-500 border-blue-500"
                    onClick={handleSaveChanges}
                    disabled={isSaving}
                  >
                    {isSaving ? "Salvando..." : "Salvar Alterações"}
                  </Button>
                  <Button variant="outline" onClick={() => router.push("/app")}>
                    Cancelar
                  </Button>
                </div>
                <Button
                  className="border-2 text-white bg-red-500 border-red-500"
                  variant="destructive"
                  onClick={handleDeleteAccount}
                >
                  Excluir Conta
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
