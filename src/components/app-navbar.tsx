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
    <header className="h-14 border-b border-green-800 bg-white px-4 flex items-center justify-between">
      <div className="flex items-center">
        <Link href="/app" className="flex items-center gap-2 mr-4">
          <Image
            src="/LOGOBRASFI.png"
            alt="Logo BRASFI"
            width={32}
            height={32}
            className="h-8 w-auto"
          />
        </Link>
      </div>
      {/* Barra de pesquisa centralizada */}
      <div className="flex-1 flex justify-center max-w-xl mx-auto">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar..."
            className="pl-9 h-9 bg-gray-50 border-green-800 focus-visible:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
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
                className="h-9 w-9 flex items-center justify-center rounded-full text-white text-lg font-bold ring-2 ring-blue-200"
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
