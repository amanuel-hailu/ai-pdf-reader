"use client";
import React from "react";
import { Input } from "./ui/input";
import { useChat } from "ai/react";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import MessageList from "./MessageList";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Message } from "ai";

type Props = { chatId: number };

const ChatComponent = ({ chatId }: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const response = await axios.post<Message[]>("/api/get-messages", {
        chatId,
      });
      return response.data;
    },
  });

  const { input, handleInputChange, handleSubmit, messages } = useChat({
    api: "/api/chat",
    body: {
      chatId,
    },
    initialMessages: data || [],
  });
  React.useEffect(() => {
    const messageListContainer = document.getElementById(
      "message-list-container"
    );
    if (messageListContainer) {
      messageListContainer.scrollTo({
        top: messageListContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-100" id="message-container">
      {/* header */}
      <div className="sticky inset-x-0 top-0 z-10 flex items-center justify-center p-4 bg-white shadow-md">
        <h3 className="text-xl font-semibold text-gray-700">PDF AI Chat</h3>
      </div>

      {/* message list */}
      <div
        className="flex-grow px-4 pt-4 pb-4 overflow-y-auto"
        id="message-list-container"
      >
        <MessageList messages={messages} isLoading={isLoading} />
      </div>

      {/* Input form */}
      <form
        onSubmit={handleSubmit}
        className="z-10 flex-none p-4 bg-white border-t border-gray-200 shadow-md"
      >
        <div className="flex items-center">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask any question..."
            className="flex-grow px-4 py-2 mr-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button className="px-4 py-2 transition-colors duration-200 bg-blue-600 hover:bg-blue-700 rounded-r-md">
            <Send className="w-4 h-4 text-white" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;
