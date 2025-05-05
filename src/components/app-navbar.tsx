"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogOut, Search, Settings, User, Shield, Bell } from "lucide-react";
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
    <header className="h-15 border-b border-green-800 bg-white px-4 flex items-center justify-between">
      <div className="flex items-center">
        <Link href="/app" className="flex items-center gap-2 mr-4">
          <h1 className="text-green-500 text-3xl">BRASFI</h1>
        </Link>
      </div>

      <div className="flex items-center gap-6">
        {/* Botão de Admin para usuários administradores */}
        {user.isAdmin && (
          <Button
            variant="outline"
            size="sm"
            className="mr-2 text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-300 ease-in-out hover:scale-105 hover:shadow-lg cursor-pointer"
            onClick={() => router.push("/app/admin")}
          >
            <Shield className="h-4 w-4 mr-1" />
            Admin
          </Button>
        )}

        {/* Notificação */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="relative">
              <Bell className="cursor-pointer" />
              <span className="absolute -top-1 -right-1 flex size-3 cursor-pointer">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex size-3 rounded-full bg-sky-500"></span>
              </span>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-56 bg-white border border-gray-200 rounded-lg shadow-lg p-2"
          >
            <DropdownMenuLabel className="text-sm font-semibold text-gray-700 px-3 py-2">
              Notificações
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="border-t border-gray-200 my-1" />

            <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 text-gray-700 cursor-pointer hover:bg-gray-100">
              <h1>Novo evento agendado</h1>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-4 px-3 py-2 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 cursor-pointer"
            >
              {/* Nome e email */}
              <div className="text-left hidden sm:block">
                <div className="text-sm font-semibold text-gray-800 leading-tight">
                  {user.name}
                </div>
                <div className="text-xs text-gray-500 leading-tight">
                  {user.email}
                </div>
              </div>
              {/* Inicial e cor do usuário */}
              <div
                className="h-9 w-9 flex items-center justify-center rounded-full text-white text-lg font-bold"
                style={{ backgroundColor: avatarColor }}
              >
                {userInitials}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-white border border-gray-200 rounded-lg shadow-lg p-2"
          >
            <DropdownMenuLabel className="text-sm font-semibold text-gray-700 px-3 py-2">
              Minha Conta
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="border-t border-gray-200 my-1" />
            <DropdownMenuItem
              onClick={() => router.push("/app/profile")}
              className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md cursor-pointer transition-colors duration-200"
            >
              <User className="h-4 w-4 text-gray-500 group-hover:text-blue-600" />
              <span>Perfil</span>
            </DropdownMenuItem>
            {user.isAdmin && (
              <DropdownMenuItem
                onClick={() => router.push("/app/admin")}
                className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md cursor-pointer transition-colors duration-200"
              >
                <Shield className="h-4 w-4 text-gray-500 group-hover:text-blue-600" />
                <span>Painel Admin</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => router.push("/app/settings")}
              className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md cursor-pointer transition-colors duration-200"
            >
              <Settings className="h-4 w-4 text-gray-500 group-hover:text-blue-600" />
              <span>Configurações</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="border-t border-gray-200 my-1" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-md cursor-pointer transition-colors duration-200"
            >
              <LogOut className="h-4 w-4 text-red-500 group-hover:text-red-700" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
