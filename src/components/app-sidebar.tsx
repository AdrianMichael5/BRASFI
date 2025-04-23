"use client";

import type React from "react";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Hash,
  Megaphone,
  Plus,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

interface AppSidebarProps {
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
}

export function AppSidebar({
  user,
  categories,
  setCategories,
  currentChannelId,
  setCurrentChannelId,
}: AppSidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({
    project: true,
    information: true,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [newChannelDescription, setNewChannelDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("project");

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const handleCreateChannel = () => {
    if (!newChannelName.trim()) return;

    const newChannel: Channel = {
      id: newChannelName.toLowerCase().replace(/\s+/g, "-"),
      name: newChannelName.trim(),
      description: newChannelDescription.trim() || undefined,
    };

    const updatedCategories = categories.map((category) => {
      if (category.id === selectedCategory) {
        return {
          ...category,
          channels: [...category.channels, newChannel],
        };
      }
      return category;
    });

    setCategories(updatedCategories);
    localStorage.setItem("categories", JSON.stringify(updatedCategories));

    // Limpar e fechar
    setNewChannelName("");
    setNewChannelDescription("");
    setIsDialogOpen(false);

    // Selecionar o novo canal
    setCurrentChannelId(newChannel.id);
  };

  return (
    <div className="w-64 bg-[#f9f9f9] border-r border-gray-200 flex flex-col h-full">
      {/* Workspace Header */}
      <div className="p-3 border-b border-gray-200">
        <h2 className="font-bold text-lg text-blue-600">BRASFI Connect</h2>
      </div>

      {/* Channels List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {categories.map((category) => (
            <div key={category.id} className="mb-4">
              <button
                className="flex items-center w-full text-xs font-semibold text-gray-500 hover:text-gray-700 mb-1 px-2"
                onClick={() => toggleCategory(category.id)}
              >
                {expandedCategories[category.id] ? (
                  <ChevronDown className="h-3.5 w-3.5 mr-1" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 mr-1" />
                )}
                {category.name}
              </button>

              {expandedCategories[category.id] && (
                <div className="space-y-1 ml-2">
                  {category.channels.map((channel) => (
                    <button
                      key={channel.id}
                      className={cn(
                        "flex items-center w-full text-sm px-2 py-1 rounded-md",
                        currentChannelId === channel.id
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                      onClick={() => setCurrentChannelId(channel.id)}
                    >
                      <span className="text-gray-400 mr-2">
                        {channel.isAnnouncement ? (
                          <Megaphone className="h-3.5 w-3.5" />
                        ) : (
                          <Hash className="h-3.5 w-3.5" />
                        )}
                      </span>
                      {channel.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Add Channel Button */}
      {user.isAdmin && (
        <div className="p-3 border-t border-gray-200">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="w-full flex items-center justify-center hover:bg-blue-50 active:bg-blue-100 text-blue-600 border-blue-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Canal
              </Button >
            </DialogTrigger>
            <DialogContent className="bg-white ">
              <DialogHeader>
                <DialogTitle>Criar Novo Canal</DialogTitle>
                <DialogDescription>
                  Adicione um novo canal à sua área de trabalho.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 ">
                <div className="grid gap-2 ">
                  <Label htmlFor="category">Categoria</Label>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome do Canal</Label>
                  <Input
                    id="name"
                    value={newChannelName}
                    onChange={(e) => setNewChannelName(e.target.value)}
                    placeholder="ex: design-project"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Descrição (opcional)</Label>
                  <Input
                    id="description"
                    value={newChannelDescription}
                    onChange={(e) => setNewChannelDescription(e.target.value)}
                    placeholder="Descreva o propósito deste canal"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button className="bg-blue-600 text-white" onClick={handleCreateChannel}>Criar Canal</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}
