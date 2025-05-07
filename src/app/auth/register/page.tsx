"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Leaf, Book, Globe, Users } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!name || !email || !password || !confirmPassword) {
        setError("Por favor, preencha todos os campos.");
        return;
      }

      if (!isValidEmail(email)) {
        setError("Por favor, insira um email válido.");
        return;
      }

      if (password !== confirmPassword) {
        setError("As senhas não coincidem.");
        return;
      }

      const usersJson = localStorage.getItem("users");
      const users = usersJson ? JSON.parse(usersJson) : [];
      const userExists = users.some((u: any) => u.email === email);

      if (userExists) {
        setError("Este email já está cadastrado.");
        return;
      }

      const newUser = { name, email, password };
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));

      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem(
        "user",
        JSON.stringify({
          name,
          email,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        })
      );

      router.push("/app");
    } catch (err) {
      setError("Falha ao criar conta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Lado esquerdo */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-b from-green-700 to-green-500 text-white flex-col justify-center items-center p-10 space-y-6">
        <div className="text-4xl font-bold">BRASFI Connect</div>
        <div className="text-lg">Transformando educação e meio ambiente para um futuro melhor.</div>
        <ul className="space-y-3 text-left">
      <li className="flex items-center">
        <Leaf className="mr-2" size={20} />
        Educação Ambiental
      </li>
      <li className="flex items-center">
        <Book className="mr-2" size={20} />
        Acesso a Cursos
      </li>
      <li className="flex items-center">
        <Globe className="mr-2" size={20} />
        Projetos Sustentáveis
      </li>
      <li className="flex items-center">
        <Users className="mr-2" size={20} />
        Comunidade Engajada
      </li>
    </ul>
      </div>

      {/* Lado direito - Formulário de Cadastro */}
      <div className="flex w-full md:w-1/2 justify-center items-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="flex justify-end mb-4">
            <Link href="/">
              <Button className="cursor-pointer" variant="outline" size="sm">
                <ArrowLeft size={16} />
                Voltar para o Início
              </Button>
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
            <h1 className="text-2xl font-bold text-center text-green-700">Criar Conta</h1>
            <p className="text-sm text-gray-500 text-center">Crie uma conta para acessar todos os recursos!</p>

            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded text-sm text-center">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                className="focus:ring-green-600 border border-gray-300"
                id="name"
                type="text"
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                className="focus:ring-green-600 border border-gray-300"
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                className="focus:ring-green-600 border border-gray-300"
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                className="focus:ring-green-600 border border-gray-300"
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? "Criando..." : "Criar Conta"}
            </Button>

            <p className="text-sm text-center text-gray-500">
              Já tem uma conta?{" "}
              <Link href="/auth/login" className="text-green-700 hover:underline">
                Entre aqui
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
