"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Navbar } from "@/components/navbar";

// Função para validar email
const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Validação básica
      if (!name || !email || !password) {
        setError("Por favor, preencha todos os campos.");
        setIsLoading(false);
        return;
      }

      if (!isValidEmail(email)) {
        setError("Por favor, insira um email válido.");
        setIsLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError("As senhas não coincidem.");
        setIsLoading(false);
        return;
      }

      if (password.length < 6) {
        setError("A senha deve ter pelo menos 6 caracteres.");
        setIsLoading(false);
        return;
      }

      // Verificar se o email já está cadastrado
      const usersJson = localStorage.getItem("users");
      const users = usersJson ? JSON.parse(usersJson) : [];

      if (users.some((user: any) => user.email === email)) {
        setError("Este email já está cadastrado. Tente fazer login.");
        setIsLoading(false);
        return;
      }

      // Determinar se o usuário é admin (para demonstração, emails com "admin" são admins)
      const isAdmin = email.includes("admin");

      // Salvar o novo usuário
      const newUser = { name, email, password, isAdmin };
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));

      // Armazenar informações de autenticação no localStorage
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem(
        "user",
        JSON.stringify({
          name,
          email,
          isAdmin,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        })
      );

      // Redirecionar para a aplicação principal
      router.push("/app");
    } catch (err) {
      setError("Falha ao criar conta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-12 max-w-md">
        <div className="mb-8">
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft size={16} />
              Voltar para Home
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              Criar uma conta
            </CardTitle>
            <CardDescription>
              Preencha os dados abaixo para criar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
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
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <p className="text-xs text-gray-500">
                  A senha deve ter pelo menos 6 caracteres
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? "Criando conta..." : "Cadastrar"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-gray-500">
              Já tem uma conta?{" "}
              <Link
                href="/auth/login"
                className="text-green-600 hover:underline"
              >
                Entrar
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
