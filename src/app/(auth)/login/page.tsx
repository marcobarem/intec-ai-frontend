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
import { LoginSchema, LoginFormData } from "@/lib/validators/auth"; // Ajustei para @/lib/validators/auth

import { signIn } from "next-auth/react";

import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormData) {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });
      console.log(result);

      if (result?.error) {
        if (result.error === "CredentialsSignin") {
          toast.error("E-mail ou senha inválidos.");
        } else {
          toast.error("Erro ao realizar login. Tente novamente.");
        }
      } else if (result?.ok) {
        toast.success("Login realizado com sucesso!");
        router.push("/chat");
      }
    } catch (error) {
      console.error("Erro inesperado no login:", error);
      toast.error("Ocorreu um erro inesperado. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Digite seu e-mail e senha para acessar sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
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
                    <FormMessage />{" "}
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
                    <FormMessage />{" "}
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}{" "}
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

              <div className="mt-4 text-center text-sm">
                Não tem uma conta?{" "}
                <Link href="/register" className="underline">
                  Cadastre-se
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
