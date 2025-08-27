"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Check,
  Star,
  BarChart3,
  ArrowRight,
  Menu,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Fuel,
  Lightbulb,
  DollarSign,
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function LandingPage() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const logoPath = "/logo-smartpetro.svg";

  const navigationItems = [
    { href: "#features", label: "Recursos" },
    { href: "#testimonials", label: "Depoimentos" },
    { href: "#contact", label: "Contato" },
  ];

  const features = [
    {
      icon: Fuel,
      title: "Análise de Vendas Inteligente",
      description:
        "Obtenha insights detalhados sobre suas vendas de combustível e loja de conveniência, identificando picos e quedas.",
    },
    {
      icon: BarChart3,
      title: "Relatórios Personalizados via Chat",
      description:
        "Peça relatórios específicos ao chatbot sobre estoque, faturamento e desempenho, de forma intuitiva.",
    },
    {
      icon: Lightbulb,
      title: "Previsão e Otimização de Estoque",
      description:
        "Utilize a inteligência artificial para prever demandas e otimizar seus níveis de estoque, evitando perdas e faltas.",
    },
    {
      icon: DollarSign,
      title: "Gestão de Preços Dinâmica",
      description:
        "Monitore a concorrência e receba recomendações de preços para maximizar sua margem de lucro.",
    },
  ];

  const testimonials = [
    {
      name: "Carlos Andrade",
      role: "Proprietário, Posto Boa Vista",
      image: "/placeholders/man2.png",
      content:
        "O chatbot da Smartpetro mudou a forma como acesso meus dados. É rápido, intuitivo e me dá as respostas que preciso para tomar decisões inteligentes.",
    },
    {
      name: "Mariana Costa",
      role: "Gerente, Rede de Postos Líder",
      image: "/placeholders/woman.png",
      content:
        "A integração com a minha gestão de estoque e vendas é impecável. Consigo otimizar tudo em tempo real, diretamente pelo chat.",
    },
    {
      name: "Pedro Dantas",
      role: "CEO, Combustíveis Inteligentes",
      image: "/placeholders/man.png",
      content:
        "A Smartpetro nos deu uma vantagem competitiva. As análises de mercado via IA são um diferencial para nossas estratégias de preço.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-7xl">
          <div className="flex items-center space-x-2">
            <Image
              src={logoPath || "/placeholder.svg"}
              alt="Logo Smartpetro"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-xl md:text-2xl font-bold">Smartpetro</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm font-medium text-muted-foreground max-w-32 truncate">
                  Olá, {session?.user?.name || session?.user?.email}!
                </span>
                <Link href="/chat" passHref>
                  <Button>Ir para o Chat</Button>
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                >
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" passHref>
                  <Button variant="ghost">Entrar</Button>
                </Link>
                <Link href="/register" passHref>
                  <Button>Criar Conta</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="flex md:hidden items-center space-x-2">
            {isAuthenticated && (
              <Link href="/chat" passHref>
                <Button size="sm">Chat</Button>
              </Link>
            )}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-6 mt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Image
                        src={logoPath || "/placeholder.svg"}
                        alt="Logo Smartpetro"
                        width={30}
                        height={30}
                        className="rounded-full"
                      />
                      <span className="text-lg font-bold">Smartpetro</span>
                    </div>
                  </div>

                  <nav className="flex flex-col space-y-4">
                    {navigationItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="text-lg font-medium hover:text-primary transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>

                  <div className="flex flex-col space-y-3 pt-6 border-t">
                    {isAuthenticated ? (
                      <>
                        <p className="text-sm text-muted-foreground">
                          Olá, {session?.user?.name || session?.user?.email}!
                        </p>
                        <Link href="/chat" passHref>
                          <Button
                            className="w-full"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Ir para o Chat
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          className="w-full"
                          onClick={() => {
                            signOut({ callbackUrl: "/login" });
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          Sair
                        </Button>
                      </>
                    ) : (
                      <>
                        <Link href="/login" passHref>
                          <Button
                            variant="ghost"
                            className="w-full"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Entrar
                          </Button>
                        </Link>
                        <Link href="/register" passHref>
                          <Button
                            className="w-full"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Criar Conta
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section
          className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative overflow-hidden text-white"
          style={{
            background: "radial-gradient(circle at center, #1E40AF, #000000)",
          }}
        >
          <div
            className="bg-pattern"
            style={{
              zIndex: 1,
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
            }}
          />

          <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-6 text-center lg:text-left">
                <div className="space-y-4">
                  <Badge
                    variant="secondary"
                    className="w-fit mx-auto lg:mx-0 bg-blue-400 text-blue-900 hover:bg-blue-300"
                  >
                    ⛽ Nova era para Postos de Combustível!
                  </Badge>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                    Smartpetro: Inteligência para o Sucesso do Seu Posto
                  </h1>
                  <p className="max-w-[600px] text-blue-100 text-lg md:text-xl mx-auto lg:mx-0">
                    Com nosso chatbot de IA, acesse informações em tempo real,
                    otimize suas operações e aumente a rentabilidade do seu
                    posto de gasolina.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link href={isAuthenticated ? "/chat" : "/register"} passHref>
                    <Button
                      size="lg"
                      className="h-12 px-8 bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                    >
                      {isAuthenticated
                        ? "Ir para o Chat"
                        : "Experimente Grátis"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#contact" passHref>
                    <Button
                      variant="outline"
                      size="lg"
                      className="h-12 px-8 border-white text-black hover:bg-white hover:text-blue-600 w-full sm:w-auto"
                    >
                      Falar com um Especialista
                    </Button>
                  </Link>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-blue-200 justify-center lg:justify-start">
                  <div className="flex items-center space-x-1">
                    <Check className="h-4 w-4 text-green-400" />
                    <span>Acesso imediato</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Check className="h-4 w-4 text-green-400" />
                    <span>Suporte dedicado</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center order-first lg:order-last">
                <Image
                  src="/placa-viva.png"
                  width={600}
                  height={400}
                  alt="Smartpetro Dashboard"
                  className="w-full max-w-lg aspect-video overflow-hidden rounded-xl object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-muted"
        >
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-4">
                <Badge variant="default">Recursos</Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Inteligência que Transforma seu Negócio
                </h2>
                <p className="max-w-[900px] text-muted-foreground text-lg md:text-xl">
                  Nosso chatbot e plataforma oferecem ferramentas completas para
                  você gerenciar seus postos com eficiência e inteligência.
                </p>
              </div>
            </div>
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="grid gap-8 order-last lg:order-first">
                {features.map((feature, index) => (
                  <div key={index} className="grid gap-3">
                    <div className="flex items-center space-x-3 justify-center md:justify-start">
                      <feature.icon className="h-6 w-6 text-primary flex-shrink-0" />
                      <h3 className="text-xl font-bold text-center md:text-left">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground text-center md:text-left">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center order-first lg:order-last">
                <Image
                  src="/reports.png"
                  width={500}
                  height={400}
                  alt="Smartpetro Features"
                  className="w-full max-w-lg aspect-video overflow-hidden rounded-xl object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-4">
                <Badge variant="secondary">Depoimentos</Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  O que dizem os donos de postos
                </h2>
                <p className="max-w-[900px] text-muted-foreground text-lg md:text-xl">
                  Veja como a Smartpetro está revolucionando a gestão de postos
                  de combustível.
                </p>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="flex flex-col h-full">
                  <CardHeader className="text-center">
                    <div className="flex items-center space-x-1 justify-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-primary text-primary"
                        />
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent className="text-center flex-grow">
                    <p className="text-muted-foreground">
                      {testimonial.content}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <div className="flex items-center space-x-3">
                      <Image
                        src={testimonial.image || "/placeholder.svg"}
                        width={40}
                        height={40}
                        alt={testimonial.name}
                        className="rounded-full"
                      />
                      <div className="text-left">
                        <p className="text-sm font-medium">
                          {testimonial.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Pronto para otimizar a gestão do seu posto?
                </h2>
                <p className="max-w-[600px] text-muted-foreground text-lg md:text-xl mx-auto">
                  Junte-se a outros donos de postos que já estão transformando
                  sua produtividade com a Smartpetro.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md">
                <Link href={isAuthenticated ? "/chat" : "/register"} passHref>
                  <Button size="lg" className="h-12 px-8 w-full sm:w-auto">
                    {isAuthenticated ? "Acessar Chat" : "Começar Grátis"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#contact" passHref>
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12 px-8 w-full sm:w-auto"
                  >
                    Agendar Demonstração
                  </Button>
                </Link>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-muted-foreground justify-center">
                <div className="flex items-center space-x-1">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Sem compromisso</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Cancelamento flexível</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Configuração em minutos</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="w-full border-t bg-muted">
        <div className="container mx-auto px-4 md:px-6 py-12 max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 text-center md:text-left">
            <div className="space-y-4 flex flex-col items-center md:items-start">
              <div className="flex items-center space-x-2">
                <Image
                  src={logoPath || "/placeholder.svg"}
                  alt="Logo Smartpetro"
                  width={30}
                  height={30}
                  className="rounded-full"
                />
                <span className="text-xl font-bold">Smartpetro</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs">
                Transformando dados em decisões lucrativas para o seu posto de
                gasolina com inteligência artificial.
              </p>
              <div className="flex space-x-4 justify-center md:justify-start">
                <Link href="#" passHref>
                  <Button variant="ghost" size="icon">
                    <Facebook className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#" passHref>
                  <Button variant="ghost" size="icon">
                    <Twitter className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#" passHref>
                  <Button variant="ghost" size="icon">
                    <Linkedin className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#" passHref>
                  <Button variant="ghost" size="icon">
                    <Instagram className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Produto</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#features"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Recursos
                  </Link>
                </li>
                <li>
                  <Link
                    href="#pricing"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Planos
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Integrações
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Empresa</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Sobre Nós
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Carreiras
                  </Link>
                </li>
                <li>
                  <Link
                    href="#contact"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Contato
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Suporte</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Central de Ajuda
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Documentação
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Status
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Segurança
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">
              © 2025 Smartpetro. Todos os direitos reservados.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
              <Link href="#" className="hover:text-foreground">
                Política de Privacidade
              </Link>
              <Link href="#" className="hover:text-foreground">
                Termos de Serviço
              </Link>
              <Link href="#" className="hover:text-foreground">
                Política de Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
