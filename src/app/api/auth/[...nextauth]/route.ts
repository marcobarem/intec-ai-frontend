import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { api } from "@/lib/api/axios";
import axios from "axios";

import {
  AuthorizedUser,
  BackendUser,
  CustomJWT,
  CustomSession,
} from "@lib/auth/types";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "jsmith@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          console.log("Credenciais incompletas.");
          return null;
        }

        let accessToken: string | null = null;
        let userData: BackendUser;

        try {
          const loginResponse = await api.post("/auth/login", {
            email: credentials.email,
            password: credentials.password,
          });

          const loginData = loginResponse.data.data;

          if (!loginData || !loginData.access_token) {
            console.log(
              "Login bem-sucedido, mas token de acesso não encontrado na resposta."
            );
            return null;
          }

          accessToken = loginData.access_token;

          const userMeResponse = await api.get("/users/me", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          userData = userMeResponse.data.data;

          if (!userData) {
            console.log("Dados do usuário não encontrados em /users/me.");
            return null;
          }

          return {
            id: userData.id,
            name: userData.name || userData.email,
            email: userData.email,
            accessToken: accessToken,
          } as AuthorizedUser;
        } catch (error) {
          if (axios.isAxiosError(error)) {
            if (error.response) {
              console.error(
                "Erro de API durante login/busca de usuário:",
                error.response.status,
                error.response.data
              );
            } else if (error.request) {
              console.error("Nenhuma resposta do servidor:", error.request);
            } else {
              console.error("Erro ao configurar requisição:", error.message);
            }
          } else {
            console.error("Erro inesperado:", error);
          }
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const authorizedUser = user as AuthorizedUser;

        token.id = authorizedUser.id;
        token.email = authorizedUser.email;
        token.name = authorizedUser.name;
        token.accessToken = authorizedUser.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      const customToken = token as unknown as CustomJWT;

      (session as CustomSession).accessToken = customToken.accessToken;
      (session as CustomSession).user.id = customToken.id;
      (session as CustomSession).user.email = customToken.email;
      (session as CustomSession).user.name = customToken.name;
      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24,
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
