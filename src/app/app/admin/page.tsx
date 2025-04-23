"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminPanel } from "@/components/admin-panel";
import { AppLayout } from "@/components/app-layout";

export default function AdminPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Verificar se o usuário está autenticado e é admin
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const userData = localStorage.getItem("user");

    if (!isAuthenticated || !userData) {
      // Redirecionar para a página de login se não estiver autenticado
      router.push("/auth/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      // Verificar se é admin
      if (!parsedUser.isAdmin) {
        alert("Você não tem permissão para acessar o painel de administração.");
        router.push("/app");
        return;
      }
    } catch (e) {
      console.error("Erro ao analisar dados do usuário:", e);
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("user");
      router.push("/auth/login");
    }

    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user || !user.isAdmin) {
    return null;
  }

  return (
    <AppLayout
      user={user}
      categories={[]}
      setCategories={() => {}}
      currentChannelId={null}
      setCurrentChannelId={() => {}}
    >
      <AdminPanel />
    </AppLayout>
  );
}
