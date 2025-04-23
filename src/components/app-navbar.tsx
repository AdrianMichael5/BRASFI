"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogOut, Search, Settings, User, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { getInitials, getRandomColor } from "@/lib/utils";

interface AppNavbarProps {
  user: {
    name: string;
    email: string;
    avatar: string;
    isAdmin: boolean;
  };
}

export function AppNavbar({ user }: AppNavbarProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    router.push("/");
  };

  // Gerar cor aleatória e iniciais para o avatar
  const userInitials = getInitials(user.name);
  const avatarColor = getRandomColor(user.email);

  return (
    <header className="h-14 border-b border-gray-200 bg-white px-4 flex items-center justify-between">
      <div className="flex items-center">
        <Link href="/app" className="flex items-center gap-2 mr-4">
          <div className="font-bold text-xl text-green-500">BRASFI</div>
        </Link>
      </div>

      {/* Barra de pesquisa centralizada */}
      <div className="flex-1 flex justify-center max-w-xl mx-auto">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar..."
            className="pl-9 h-9 bg-gray-50 border-gray-200 focus-visible:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Botão de Admin para usuários administradores */}
        {user.isAdmin && (
          <Button
            variant="outline"
            size="sm"
            className="mr-2 text-blue-600"
            onClick={() => router.push("/app/admin")}
          >
            <Shield className="h-4 w-4 mr-1" />
            Admin
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-4 px-2 py-1 rounded-md hover:bg-gray-100 transition"
            >
              {/* Nome e email */}
              <div className="text-left hidden sm:block">
                <div className="text-sm font-medium text-gray-800 leading-tight">
                  {user.name}
                </div>
                <div className="text-xs text-gray-500 leading-tight">
                  {user.email}
                </div>
              </div>
              {/* Bolinha com inicial e cor aleatória */}
              <div
                className="h-10 w-10 flex items-center justify-center rounded-full text-white text-lg font-bold"
                style={{ backgroundColor: avatarColor }}
              >
                {userInitials}
              </div>
            </Button >
          </DropdownMenuTrigger >
          <DropdownMenuContent align="end" className="w-56 bg-white">
            <DropdownMenuLabel >Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/app/profile")}>
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            {user.isAdmin && (
              <DropdownMenuItem onClick={() => router.push("/app/admin")}>
                <Shield className="mr-2 h-4 w-4" />
                <span>Painel Admin</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
