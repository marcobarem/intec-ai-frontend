"use client";

import type * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Home,
  MessageSquarePlus,
  Settings,
  LogOut,
  Loader2,
  Bot,
  CircleUserRound,
  Plus,
  MessageSquare,
} from "lucide-react";

import type { Chat } from "@/features/chat/types";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatSidebarProps {
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onCreateNewChat: () => void;
  chats: Chat[] | undefined;
  isChatsLoading: boolean;
  chatsError: Error | null;
  user: { name?: string | null; email?: string | null; id?: string } | null;
  isAuthLoading: boolean;
  handleLogout: () => Promise<void>;
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  isExternal?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({
  href,
  icon,
  label,
  active,
  onClick,
  disabled,
  isExternal,
}) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        {isExternal ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
              active && "bg-accent text-accent-foreground"
            )}
          >
            {icon}
            <span className="sr-only">{label}</span>
          </a>
        ) : (
          <Link href={href} passHref>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
                active && "bg-accent text-accent-foreground",
                disabled && "pointer-events-none opacity-50"
              )}
              onClick={onClick}
              disabled={disabled}
            >
              {icon}
              <span className="sr-only">{label}</span>
            </Button>
          </Link>
        )}
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export function ChatSidebar({
  activeChatId,
  onSelectChat,
  onCreateNewChat,
  chats,
  isChatsLoading,
  chatsError,
  user,
  isAuthLoading,
  handleLogout,
}: ChatSidebarProps) {
  const pathname = usePathname();

  if (isAuthLoading) {
    return (
      <div className="flex h-full w-full flex-col border-r bg-background">
        <nav className="flex flex-col items-center gap-4 px-2 py-5">
          <Link
            href="/"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8"
          >
            <Bot className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">Smartpetro Bot</span>
          </Link>
          <NavItem
            href="/"
            icon={<Home className="h-5 w-5" />}
            label="Página Inicial"
            active={pathname === "/"}
          />
          <NavItem
            href="/chat"
            icon={<MessageSquarePlus className="h-5 w-5" />}
            label="Novo Chat"
            active={pathname === "/chat"}
          />
          <NavItem
            href="/settings"
            icon={<Settings className="h-5 w-5" />}
            label="Configurações"
            active={pathname.startsWith("/settings")}
          />
        </nav>
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col border-r bg-background">
      <nav className="flex flex-col items-center gap-4 px-2 py-5">
        <Link
          href="/"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8"
        >
          <Bot className="h-4 w-4 transition-all group-hover:scale-110" />
          <span className="sr-only">Smartpetro Bot</span>
        </Link>
        <NavItem
          href="/"
          icon={<Home className="h-5 w-5" />}
          label="Página Inicial"
          active={pathname === "/"}
        />
        <NavItem
          href="/#"
          icon={<Settings className="h-5 w-5" />}
          label="Configurações"
          active={pathname.startsWith("/settings")}
        />
      </nav>

      {/* Botão Nova Conversa */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <Button
          onClick={onCreateNewChat}
          className="w-full justify-start gap-2"
          variant="outline"
        >
          <Plus className="h-4 w-4" />
          Nova conversa
        </Button>
      </div>

      {/* Lista de Chats */}
      <ScrollArea className="flex-1 p-2">
        {isChatsLoading ? (
          <div className="text-center p-4 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
            Carregando chats...
          </div>
        ) : chatsError ? (
          <div className="text-center p-4 text-destructive text-sm">
            Erro ao carregar chats: {chatsError.message}
          </div>
        ) : chats && chats.length > 0 ? (
          <div className="space-y-1">
            {chats.map((chat) => (
              <Button
                key={chat._id}
                variant={activeChatId === chat._id ? "secondary" : "ghost"}
                className="w-full justify-start gap-2 h-auto p-3 text-left"
                onClick={() => onSelectChat(chat._id)}
              >
                <MessageSquare className="h-4 w-4 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">
                    {chat.title}
                  </div>
                  {chat.updatedAt && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {chat.updatedAt.toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </div>
                  )}
                </div>
              </Button>
            ))}
          </div>
        ) : (
          <div className="text-center p-4 text-muted-foreground text-sm">
            Nenhum chat encontrado. Comece uma nova conversa!
          </div>
        )}
      </ScrollArea>

      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.name || user?.email}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Usuário ativo
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="flex-1" asChild>
                  <Link href="/#">
                    <CircleUserRound className="h-4 w-4 mr-2" />
                    Perfil
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Perfil do usuário</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Sair</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
