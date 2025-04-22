"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogOut, Search, Settings, User } from "lucide-react";
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
          <div className="font-bold text-xl text-blue-600">BRASFI</div>
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              {user.avatar ? (
                <Image
                  src={user.avatar || "/placeholder.svg"}
                  alt={user.name}
                  width={36}
                  height={36}
                  className="rounded-full"
                />
              ) : (
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white font-medium"
                  style={{ backgroundColor: avatarColor }}
                >
                  {userInitials}
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/app/profile")}>
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
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
