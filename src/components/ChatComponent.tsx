"use client";
import { useChat } from "ai/react";
import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import MessageList from "./MessageList";

type Props = {};

const chatComponent = (props: Props) => {
  const { input, handleInputChange, handleSubmit, messages } = useChat({
    api: "/api/chat",
  });
  return (
    <div className="relative max-h-screen overflow-scroll ">
      {/* header */}
      <div className="sticky inset-x-0 top-0 p-2 bg-white h-fit">
        <h3>Chat</h3>
      </div>
      {/* message list */}
      <MessageList messages={messages} />
      <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 px-2 py-2 bg-white insert-x-0"
      >
        <div className="flex">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask any question..."
            className="w-full"
          />
          <Button className="ml-2 bg-blue-600">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default chatComponent;
