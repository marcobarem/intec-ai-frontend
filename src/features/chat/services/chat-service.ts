import { createApiClient } from "@/lib/api/axios";
import { AxiosResponse } from "axios";

import {
  BackendChat,
  BackendMessage,
  Chat,
  Message,
  GetChatsResponse,
  GetMessagesResponse,
  SendMessageApiResponse,
} from "../types";

const transformBackendMessage = (backendMsg: BackendMessage): Message => ({
  _id: backendMsg._id,
  chatId: backendMsg.chatId,
  userId: backendMsg.userId,
  content: backendMsg.content,
  createdAt: new Date(backendMsg.createdAt),
  role: backendMsg.role === "ia" ? "assistant" : "user",
});

const transformBackendChat = (backendChat: BackendChat): Chat => ({
  _id: backendChat._id,
  userId: backendChat.userId,
  title: backendChat.title,
  createdAt: new Date(backendChat.createdAt),
  updatedAt: new Date(backendChat.updatedAt),
});

export const createChatService = (accessToken: string) => {
  const authenticatedApi = createApiClient(accessToken);

  return {
    getChats: async (): Promise<Chat[]> => {
      try {
        const response: AxiosResponse<GetChatsResponse> =
          await authenticatedApi.get("/chats");

        const chats = response.data.data.chats
          .map(transformBackendChat)
          .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
        return chats;
      } catch (error) {
        console.error("Erro ao buscar chats:", error);
        throw error;
      }
    },

    getMessagesByChatId: async (chatId: string): Promise<Message[]> => {
      try {
        const response: AxiosResponse<GetMessagesResponse> =
          await authenticatedApi.get(`/messages`, { params: { chatId } });

        const messages = response.data.data.map(transformBackendMessage);
        return messages;
      } catch (error) {
        console.error(`Erro ao buscar mensagens para o chat ${chatId}:`, error);
        throw error;
      }
    },

    sendMessageToAI: async (
      content: string,
      chatId?: string | null
    ): Promise<{
      userMessage: Message;
      iaMessage: Message;
      newChatId?: string;
    }> => {
      try {
        const requestBody: { content: string; chatId?: string } = { content };
        if (chatId) {
          requestBody.chatId = chatId;
        }

        const response: AxiosResponse<SendMessageApiResponse> =
          await authenticatedApi.post("/messages/send", requestBody);

        const backendMessages = response.data.data.messages;

        console.log({ backendMessages });

        const userMsgBackend = backendMessages.find(
          (msg) => msg.role === "user"
        );
        const iaMsgBackend = backendMessages.find((msg) => msg.role === "ia");

        if (!userMsgBackend || !iaMsgBackend) {
          throw new Error(
            "Resposta da API de mensagem inválida: Mensagens de user/IA não encontradas."
          );
        }

        const userMessage = transformBackendMessage(userMsgBackend);
        const iaMessage = transformBackendMessage(iaMsgBackend);

        let newChatId: string | undefined;
        if (!chatId) {
          newChatId = userMessage.chatId;
        }

        return { userMessage, iaMessage, newChatId };
      } catch (error) {
        console.error("Erro ao enviar mensagem/criar chat:", error);
        throw error;
      }
    },

    renameChat: async (chatId: string, newTitle: string): Promise<void> => {
      try {
        await authenticatedApi.patch(`/chats/${chatId}`, { title: newTitle });
      } catch (error) {
        console.error(`Erro ao renomear chat ${chatId}:`, error);
        throw error;
      }
    },

    deleteChat: async (chatId: string): Promise<void> => {
      try {
        await authenticatedApi.delete(`/chats/${chatId}`);
      } catch (error) {
        console.error(`Erro ao excluir chat ${chatId}:`, error);
        throw error;
      }
    },
  };
};
