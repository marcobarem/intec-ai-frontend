"use client";
import { useSession } from "next-auth/react";
import { CustomSession } from "@/lib/auth/types";

interface UseAuthReturn {
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  user: CustomSession["user"] | null;
}

export function useAuth(): UseAuthReturn {
  const { data, status } = useSession();

  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

  const session = data as CustomSession | null;

  return {
    isAuthenticated,
    isLoading,
    accessToken: session?.accessToken || null,
    user: session?.user || null,
  };
}
