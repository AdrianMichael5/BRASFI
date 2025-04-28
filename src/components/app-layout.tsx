"use client";

import type React from "react";
import { AppNavbar } from "@/components/app-navbar";
import { AppSidebar } from "@/components/app-sidebar";
import { NavigationSidebar } from "@/components/navigation-sidebar";

interface Channel {
  id: string;
  name: string;
  description?: string;
  isAnnouncement?: boolean;
}

interface Category {
  id: string;
  name: string;
  channels: Channel[];
}

interface AppLayoutProps {
  user: {
    name: string;
    email: string;
    avatar: string;
    isAdmin: boolean;
  };
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  currentChannelId: string | null;
  setCurrentChannelId: React.Dispatch<React.SetStateAction<string | null>>;
  children: React.ReactNode;
}

export function AppLayout({
  user,
  categories,
  setCategories,
  currentChannelId,
  setCurrentChannelId,
  children,
}: AppLayoutProps) {
  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <AppNavbar user={user} />
      <div className="flex flex-1 overflow-hidden">
        <NavigationSidebar />
        <AppSidebar
          user={user}
          categories={categories}
          setCategories={setCategories}
          currentChannelId={currentChannelId}
          setCurrentChannelId={setCurrentChannelId}
        />
        <main className="flex-1 overflow-auto w-full">{children}</main>
      </div>
    </div>
  );
}
