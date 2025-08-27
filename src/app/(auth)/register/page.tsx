"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, RegisterFormData } from "@lib/validators/auth";

import { api } from "@lib/api/axios";
import axios from "axios";

import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      cpf: "",
      phone: "",
    },
  });

  async function onSubmit(data: RegisterFormData) {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
        cpf: data.cpf,
        phone: data.phone === "" ? undefined : data.phone,
      });

      if (response.status === 201 || response.status === 200) {
        toast.success(
          "Registro realizado com sucesso! Faça login para continuar."
        );
        router.push("/login");
      } else {
        const errorData =
          response.data?.message || "Erro desconhecido ao registrar.";
        toast.error(errorData);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const errorMessage =
            error.response.data.error?.message ||
            "Erro ao registrar. Tente novamente.";
          console.error(
            "Erro de registro:",
            error.response.status,
            errorMessage
          );
          toast.error(errorMessage);
        } else if (error.request) {
          console.error("Nenhuma resposta do servidor:", error.request);
          toast.error("Sem resposta do servidor. Verifique sua conexão.");
        } else {
          console.error("Erro ao configurar requisição:", error.message);
          toast.error("Ocorreu um erro inesperado.");
        }
      } else {
        console.error("Erro inesperado no registro:", error);
        toast.error("Ocorreu um erro inesperado.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Cadastre-se</CardTitle>
          <CardDescription>
            Crie sua conta para começar a usar o chatbot.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="name">Nome</FormLabel>
                    <FormControl>
                      <Input
                        id="name"
                        type="text"
                        placeholder="João Silva"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">E-mail</FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="password">Senha</FormLabel>
                    <FormControl>
                      <Input
                        id="password"
                        type="password"
                        placeholder="******"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="confirmPassword">
                      Confirmar Senha
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="******"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cpf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="cpf">CPF</FormLabel>
                    <FormControl>
                      <Input
                        id="cpf"
                        type="text"
                        placeholder="123.456.789-00"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="phone">Telefone (opcional)</FormLabel>
                    <FormControl>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+55 11 91234-5678"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Registrando..." : "Registrar"}
              </Button>
              <Link href="/" passHref>
                <Button
                  variant="outline"
                  className="w-full mt-2"
                  disabled={isLoading}
                >
                  Voltar
                </Button>
              </Link>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Já tem uma conta?{" "}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
