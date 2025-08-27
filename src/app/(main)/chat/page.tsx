import ChatInterface from "@features/chat/components/chat-interface";
import { Suspense } from "react";

export default function ChatPageWrapper() {
  return (
    <div className="h-screen overflow-hidden">
      <Suspense
        fallback={
          <div className="p-4 text-muted-foreground text-center">
            Carregando chats...
          </div>
        }
      ></Suspense>
      <ChatInterface />
    </div>
  );
}
