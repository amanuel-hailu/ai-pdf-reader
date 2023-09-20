"use client";
import { DrizzleChat } from "@/lib/db/schema";
import { cn } from "@/lib/utils";
import { MessageCircle, PlusCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

type Props = {
  chats: DrizzleChat[];
  chatId: number;
};

const ChatSideBar = ({ chats, chatId }: Props) => {
  return (
    <div className="w-full h-screen p-4 text-gray-200 bg-gray-900">
      <Link href="/">
        <Button className="w-full border border-white border-dashed">
          <PlusCircle className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </Link>
      <div className="flex flex-col gap-2 mt-4">
        {chats.map((chat) => (
          <Link key={chat.id} href={`/chat/${chat.id}`}>
            <div
              className={cn("rounded-lg p-3 text-slate-300 flex items-center", {
                "bg-purple-500 text-white": chat.id === chatId,
              })}
            >
              <MessageCircle className="mr-1" />
              <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis ">
                {chat.pdfName}
              </p>
            </div>
          </Link>
        ))}
      </div>
      <div className="absolute bottom-4 left-4">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <Link href="/">Home</Link>
          <Link href="/">Source</Link>
          {/* Stripe button */}
        </div>
      </div>
    </div>
  );
};

export default ChatSideBar;
