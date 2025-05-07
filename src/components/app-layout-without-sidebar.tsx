"use client";

import type React from "react";
import { AppNavbar } from "@/components/app-navbar";
import { NavigationSidebar } from "@/components/navigation-sidebar";

interface AppLayoutWithoutSidebarProps {
  user: {
    name: string;
    email: string;
    avatar: string;
    isAdmin: boolean;
  };
  children: React.ReactNode;
}

export function AppLayoutWithoutSidebar({
  user,
  children,
}: AppLayoutWithoutSidebarProps) {
  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <AppNavbar user={user} />
      <div className="flex flex-1 overflow-hidden">
        <NavigationSidebar />
        <main className="flex-1 overflow-auto w-full">{children}</main>
      </div>
    </div>
  );
}
