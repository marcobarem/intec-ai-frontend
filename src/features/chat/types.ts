export interface BackendMessage {
  _id: string;
  chatId: string;
  userId: string;
  content: string;
  role: "user" | "ia";
  createdAt: string;
}

export interface Message extends Omit<BackendMessage, "createdAt" | "role"> {
  createdAt: Date;
  role: "user" | "assistant";
}

export interface BackendChat {
  _id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface Chat extends Omit<BackendChat, "createdAt" | "updatedAt"> {
  createdAt: Date;
  updatedAt: Date;
  lastMessage?: Message;
}

export interface GetChatsResponse {
  statusCode: number;
  data: {
    chats: BackendChat[];
  };
}
export interface GetMessagesResponse {
  statusCode: number;
  data: BackendMessage[];
}
export interface CreateChatWithMessageResponse {
  statusCode: number;
  data: { chat: BackendChat; message: BackendMessage };
}
export interface SendMessageResponse {
  statusCode: number;
  data: BackendMessage;
}

export interface SendMessageApiResponse {
  statusCode: number;
  data: {
    messages: BackendMessage[];
  };
}

export interface BaseApiResponse {
  statusCode: number;
  message: string;
}
