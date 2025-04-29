"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  MessageSquare,
  BookOpen,
  Calendar,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";

export function NavigationSidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Feed",
      href: "/app",
      icon: Home,
    },
    {
      name: "Chat",
      href: "/app/chat",
      icon: MessageSquare,
    },
    {
      name: "Cursos",
      href: "/app/courses",
      icon: BookOpen,
    },
    {
      name: "Eventos",
      href: "/app/eventos",
      icon: Calendar,
    },
  ];

  return (
    <TooltipProvider delayDuration={300}>
      <div className="w-20 bg-gray-100 border-r border-gray-200 flex flex-col items-center py-4 h-full">
        <div className="flex flex-col items-center space-y-6">
          {navItems.map((item) => {
            // Corrigir a lógica de ícone ativo para verificar exatamente a rota atual
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center w-16 py-2 rounded-md transition-all",
                  isActive
                    ? "bg-green-100 text-green-700"
                    : "text-gray-500 hover:bg-gray-200 hover:text-green-600"
                )}
              >
                <item.icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="mt-auto mb-4">
          <Link
            href="/app/profile"
            className={cn(
              "flex flex-col items-center justify-center w-16 py-2 rounded-md transition-all",
              pathname === "/app/profile"
                ? "bg-green-100 text-green-700"
                : "text-gray-500 hover:bg-gray-200 hover:text-green-600"
            )}
          >
            <Settings className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Perfil</span>
          </Link>
        </div>
      </div>
    </TooltipProvider>
  );
}
