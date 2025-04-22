import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Função para obter as iniciais de um nome
export function getInitials(name: string): string {
  if (!name) return "?";

  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

// Função para gerar uma cor aleatória baseada em uma string (email ou nome)
export function getRandomColor(seed: string): string {
  // Lista de cores vibrantes mas não muito fortes
  const colors = [
    "#4299E1", // blue-500
    "#48BB78", // green-500
    "#ED8936", // orange-500
    "#9F7AEA", // purple-500
    "#F56565", // red-500
    "#38B2AC", // teal-500
    "#ED64A6", // pink-500
    "#ECC94B", // yellow-500
    "#667EEA", // indigo-500
    "#FC8181", // red-400
  ];

  // Usar a string como seed para gerar um índice consistente
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Converter para índice positivo dentro do range do array de cores
  const index = Math.abs(hash) % colors.length;

  return colors[index];
}
