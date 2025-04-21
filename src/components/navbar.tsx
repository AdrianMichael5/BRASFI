"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const menuItems = [
  { label: "INÍCIO", href: "/" },
  { label: "SOBRE NÓS", href: "#" },
  { label: "COMO ATUAMOS", href: "#" },
  { label: "PARCEIROS", href: "#" },
  { label: "CONTATO", href: "#" },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-green-800 text-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between md:justify-start">
          {/* Logo */}
          <div className="flex items-center md:w-1/4">
            <Link href="/" className="text-xl font-bold">
              BRASFI
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden md:flex items-center justify-center space-x-6 md:w-2/4">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium hover:text-green-200 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center justify-end space-x-4 md:w-1/4">
            <Link href="/auth/login">
              <Button
                variant="outline"
                className="border-white bg-white text-green-800 hover:bg-green-50 hover:text-green-800"
              >
                Entrar
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium">
                Cadastrar
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "md:hidden absolute w-full bg-green-800 transition-all duration-300 ease-in-out",
          isMenuOpen
            ? "max-h-screen opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        )}
      >
        <div className="container mx-auto px-4 py-4 space-y-4">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="block text-sm font-medium hover:text-green-200 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="flex flex-col space-y-2 pt-4 border-t border-green-700">
            <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
              <Button
                variant="outline"
                className="w-full border-white bg-white text-green-800 hover:bg-green-50 hover:text-green-800"
              >
                Entrar
              </Button>
            </Link>
            <Link href="/auth/register" onClick={() => setIsMenuOpen(false)}>
              <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium">
                Cadastrar
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
