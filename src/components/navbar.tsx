"use client";

import type React from "react";
import { LogIn } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const menuItems = [
  { label: "INÍCIO", href: "#hero" },
  { label: "COMO ATUAMOS", href: "#about" },
  { label: "NOSSO IMPACTO", href: "#impact" },
  { label: "PARCEIROS", href: "#partners" },
  { label: "CONTATO", href: "#footer" },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Função para navegação suave
  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="absolute top-0 left-0 w-full z-50 bg-transparent text-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between md:justify-start">
          {/* Logo */}
          <div className="flex items-center md:w-1/4">
            <Link href="/">
              <Image
                src="/LOGOBRASFI.png"
                alt="BRASFILogo"
                width={100}
                height={100}
              />
            </Link>
          </div>
          {/* Desktop Navigation - Centered */}
          <nav className="hidden md:flex items-center justify-center space-x-6 md:w-2/4">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className="text-sm font-medium hover:text-green-500 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center justify-end space-x-4 md:w-1/4">
            <Link href="/auth/login">
              <Button className="text-black hover:text-black transition-all hover:scale-105 flex items-center gap-2 cursor-pointer bg-white">
                ACESSAR PLATAFORMA
                <LogIn size={20} />
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
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => scrollToSection(e, item.href)}
              className="block text-sm font-medium hover:text-green-200 transition-colors py-2"
            >
              {item.label}
            </a>
          ))}
          <div className="flex flex-col space-y-2 pt-4 border-t border-green-700">
            <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
              <Button
                variant="outline"
                className="w-full border-white bg-white text-green-800 hover:bg-green-50 hover:text-green-800 transition-all hover:scale-105"
              >
                Entrar
              </Button>
            </Link>
            <Link href="/auth/register" onClick={() => setIsMenuOpen(false)}>
              <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium transition-all hover:scale-105">
                Cadastrar
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
