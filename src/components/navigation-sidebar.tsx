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

export function NavigationSidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Início",
      href: "/app",
      icon: Home,
      exact: true,
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
    <div className="w-24 bg-white border-r border-green-800 flex flex-col items-center py-4 h-screen">
      {/* Itens principais */}
      <nav className="flex flex-col items-center gap-8 mt-4">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 text-sm font-semibold transition-colors",
                isActive
                  ? "text-green-700"
                  : "text-gray-500 hover:text-green-600"
              )}
            >
              <item.icon className="h-7 w-7" />
              <span className="text-center">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Configurações no final */}
      <div className="mt-auto mb-8">
        <Link
          href="/app/profile"
          className={cn(
            "flex flex-col items-center gap-1 text-sm font-semibold transition-colors",
            pathname === "/app/profile"
              ? "text-green-700"
              : "text-gray-500 hover:text-green-600"
          )}
        >
          <Settings className="h-7 w-7" />
          <span className="text-center">Configurações</span>
        </Link>
      </div>
    </div>
  );
}
