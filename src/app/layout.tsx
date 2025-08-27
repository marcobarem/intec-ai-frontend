import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@styles/globals.css";

import { ReactQueryProvider } from "@lib/react-query";
import { AuthProvider } from "@lib/auth";
import { Toaster } from "@components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Meu Chatbot de IA",
  description: "Um chatbot de IA construído com Next.js e Tailwind CSS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ReactQueryProvider>
          <AuthProvider>
            <TooltipProvider>{children}</TooltipProvider>
            <Toaster />
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
