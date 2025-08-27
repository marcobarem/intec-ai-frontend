"use client";

import type React from "react";
import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Send,
  User,
  Bot,
  Copy,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal,
  Loader2,
  Menu,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

import type { Chat, Message } from "@/features/chat/types";
import { createChatService } from "@features/chat/services/chat-service";

import { ChatSidebar } from "./chat-sidebar";
import { signOut } from "next-auth/react";

export default function ChatInterface() {
  const {
    user,
    isAuthenticated,
    isLoading: isAuthLoading,
    accessToken,
  } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();
  const params = useParams();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const currentChatIdFromUrl = useMemo(() => {
    if (Array.isArray(params.chatId)) {
      return params.chatId[0];
    }
    if (typeof params.chatId === "string" && params.chatId !== "new") {
      return params.chatId;
    }
    return null;
  }, [params.chatId]);

  const chatService = useMemo(() => {
    if (accessToken) {
      return createChatService(accessToken);
    }
    return null;
  }, [accessToken]);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(
    currentChatIdFromUrl
  );

  useEffect(() => {
    setActiveChatId(currentChatIdFromUrl);
  }, [currentChatIdFromUrl]);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const {
    data: chats,
    isLoading: isChatsLoading,
    error: chatsError,
  } = useQuery<Chat[], Error>({
    queryKey: ["chats"],
    queryFn: async () => {
      if (!chatService) throw new Error("Chat service not available.");
      return chatService.getChats();
    },
    enabled: isAuthenticated && !!chatService,
  });

  const {
    data: activeChatMessages,
    isLoading: isMessagesLoading,
    error: messagesError,
  } = useQuery<Message[], Error>({
    queryKey: ["messages", activeChatId],
    queryFn: async () => {
      if (!activeChatId || !chatService)
        throw new Error("Chat ID or chat service not available.");
      return chatService.getMessagesByChatId(activeChatId);
    },
    enabled: !!activeChatId && isAuthenticated && !!chatService,
  });

  useEffect(() => {
    if (!activeChatId) {
      setMessages([
        {
          _id: "initial_bot_msg",
          content:
            "Olá! Sou o Smartpetro Bot, seu assistente inteligente para gestão de postos de gasolina. Como posso te ajudar hoje?",
          role: "assistant",
          createdAt: new Date(),
          chatId: "new",
          userId: "bot",
        },
      ]);
    } else if (activeChatMessages) {
      setMessages(activeChatMessages);
    } else {
      setMessages([]);
    }
  }, [activeChatMessages, activeChatId]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  const sendMessageAndMaybeCreateChatMutation = useMutation({
    mutationFn: ({
      content,
      chatId,
    }: {
      content: string;
      chatId?: string | null;
    }) => {
      if (!chatService) throw new Error("Chat service not available.");

      return chatService.sendMessageToAI(content, chatId);
    },
    onSuccess: (data) => {
      const { userMessage, iaMessage, newChatId } = data;

      setMessages((prev) => {
        const filteredPrev = prev.filter((msg) => msg._id !== userMessage._id);
        return [...filteredPrev, userMessage, iaMessage];
      });

      if (newChatId && !activeChatId) {
        toast.success("Novo chat criado!");
        router.push(`/chat/${newChatId}`);
      } else {
        toast.success("Mensagem enviada!");
      }

      queryClient.invalidateQueries({ queryKey: ["chats"] });
      queryClient.invalidateQueries({
        queryKey: ["messages", userMessage.chatId],
      });

      setIsTyping(false);
    },
    onError: (error) => {
      toast.error("Erro ao enviar mensagem. Tente novamente.");
      console.error("Erro na mutação de enviar mensagem:", error);
      setIsTyping(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (
      !trimmedInput ||
      isTyping ||
      isAuthLoading ||
      !isAuthenticated ||
      sendMessageAndMaybeCreateChatMutation.isPending ||
      !chatService
    ) {
      if (!isAuthenticated)
        toast.warning("Por favor, faça login para enviar mensagens.");
      else if (!chatService)
        toast.error(
          "Erro: Serviço de chat não inicializado. Recarregue a página."
        );
      return;
    }

    const userMessage: Message = {
      _id: "temp-" + Date.now().toString(),
      content: trimmedInput,
      role: "user",
      createdAt: new Date(),
      chatId: activeChatId || "temp-chat",
      userId: user?.id || "temp-user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    sendMessageAndMaybeCreateChatMutation.mutate({
      content: trimmedInput,
      chatId: activeChatId,
    });
  };

  const handleSelectChat = (chatId: string) => {
    if (chatId !== activeChatId) {
      router.push(`/chat/${chatId}`);
      setIsMobileSidebarOpen(false); // Fechar sidebar no mobile após seleção
    }
  };

  const handleCreateNewChat = () => {
    router.push("/chat");
    setIsMobileSidebarOpen(false); // Fechar sidebar no mobile
  };

  const handleLogout = async () => {
    toast.info("Fazendo logout...");
    await signOut({ callbackUrl: "/login" });
    toast.success("Logout realizado com sucesso.");
  };

  if (isAuthLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-muted-foreground">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mb-4 mx-auto" />
          <p>Carregando Smartpetro Bot...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-muted-foreground p-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Acesso Restrito</h2>
          <p className="mb-4">
            Por favor,{" "}
            <Link href="/login" className="text-primary underline">
              faça login
            </Link>{" "}
            ou{" "}
            <Link href="/register" className="text-primary underline">
              crie uma conta
            </Link>{" "}
            para usar o Smartpetro Bot.
          </p>
          <Button asChild>
            <Link href="/login">Entrar no Smartpetro</Link>
          </Button>
        </div>
      </div>
    );
  }

  const sidebarContent = (
    <ChatSidebar
      activeChatId={activeChatId}
      onSelectChat={handleSelectChat}
      onCreateNewChat={handleCreateNewChat}
      chats={chats}
      isChatsLoading={isChatsLoading}
      chatsError={chatsError}
      user={user}
      handleLogout={handleLogout}
      isAuthLoading={isAuthLoading}
    />
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar - apenas visível em desktop */}
      <div className="hidden lg:block w-64 flex-shrink-0">{sidebarContent}</div>

      {/* Mobile Sidebar - apenas visível quando aberto em mobile */}
      <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          {sidebarContent}
        </SheetContent>
      </Sheet>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <Sheet
              open={isMobileSidebarOpen}
              onOpenChange={setIsMobileSidebarOpen}
            >
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
            </Sheet>

            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-blue-600 text-white">
                SP
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h1 className="font-semibold truncate">
                {activeChatId
                  ? chats?.find((c) => c._id === activeChatId)?.title || "Chat"
                  : "Novo Chat"}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Assistente Inteligente
              </p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {isMessagesLoading && activeChatId ? (
            <div className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-950 text-muted-foreground">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mb-4 mx-auto" />
                <p>Carregando mensagens...</p>
              </div>
            </div>
          ) : messagesError && activeChatId ? (
            <div className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-950 text-destructive p-4">
              <p className="text-center">
                Erro ao carregar mensagens: {messagesError.message}
              </p>
            </div>
          ) : (
            <div
              className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-950"
              ref={scrollAreaRef}
            >
              <div className="p-4 space-y-6 max-w-4xl mx-auto">
                {messages.map((message) => (
                  <div
                    key={message._id}
                    className={cn(
                      "flex gap-3 sm:gap-4",
                      message.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    {message.role === "assistant" && (
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarFallback className="bg-gray-300 dark:bg-gray-600">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={cn(
                        "flex flex-col gap-2 max-w-[85%] sm:max-w-[70%] lg:max-w-[60%]",
                        message.role === "user" && "items-end"
                      )}
                    >
                      <Card
                        className={cn(
                          "p-3 sm:p-4",
                          message.role === "user"
                            ? "bg-blue-500 text-white rounded-br-none"
                            : "bg-white dark:bg-gray-700 rounded-bl-none"
                        )}
                      >
                        <p className="text-sm leading-relaxed break-words">
                          {message.content}
                        </p>
                      </Card>

                      {message.role === "assistant" && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2"
                          >
                            <ThumbsUp className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2"
                          >
                            <ThumbsDown className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2"
                          >
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>

                    {message.role === "user" && (
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarFallback className="bg-blue-500 text-white">
                          {user?.name ? (
                            user.name.charAt(0).toUpperCase()
                          ) : (
                            <User className="h-4 w-4" />
                          )}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}

                {(isTyping ||
                  sendMessageAndMaybeCreateChatMutation.isPending) && (
                  <div className="flex gap-3 sm:gap-4 justify-start">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="bg-gray-300 dark:bg-gray-600">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-sm">
                          Smartpetro Bot
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {isTyping ? "Digitando..." : "Pensando..."}
                        </Badge>
                      </div>
                      <Card className="p-3 sm:p-4 bg-white dark:bg-gray-700 max-w-[85%] sm:max-w-[70%] lg:max-w-[60%] rounded-bl-none">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </Card>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 flex-shrink-0">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="flex gap-2 sm:gap-3">
              <div className="flex-1 relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Pergunte algo sobre seus postos de gasolina..."
                  className="pr-12 min-h-[48px] resize-none bg-white dark:bg-gray-800"
                  disabled={
                    isTyping ||
                    isAuthLoading ||
                    !isAuthenticated ||
                    sendMessageAndMaybeCreateChatMutation.isPending
                  }
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                  disabled={
                    !input.trim() ||
                    isTyping ||
                    isAuthLoading ||
                    !isAuthenticated ||
                    sendMessageAndMaybeCreateChatMutation.isPending
                  }
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>

            <div className="flex items-center justify-center mt-3">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center px-2">
                Smartpetro Bot pode cometer erros. Considere verificar
                informações importantes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
