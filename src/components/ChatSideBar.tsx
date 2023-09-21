"use client";
import { DrizzleChat } from "@/lib/db/schema";
import { cn } from "@/lib/utils";
import { MessageCircle, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import SubscriptionButton from "./SubscriptionButton";
import { Button } from "./ui/button";

type Props = {
  chats: DrizzleChat[];
  chatId: number;
  isPro: boolean;
};

const ChatSideBar = ({ chats, chatId, isPro }: Props) => {
  const [loading, setLoading] = useState(false);

  return (
    <div className="relative w-full h-screen p-4 overflow-y-auto text-gray-200 bg-gray-900 border-t-4 border-indigo-500 shadow-lg sm:p-8 dark:bg-gray-800">
      <Link href="/">
        <Button className="w-full py-3 text-lg border border-white border-dashed">
          <PlusCircle className="w-6 h-6 mr-2" />
          New Chat
        </Button>
      </Link>

      <div className="flex flex-col gap-4 mt-4">
        {chats.map((chat) => (
          <Link key={chat.id} href={`/chat/${chat.id}`}>
            <div
              className={cn(
                "rounded-lg py-3 px-4 text-base sm:text-sm flex items-center",
                {
                  "bg-purple-500 text-white": chat.id === chatId,
                }
              )}
            >
              <MessageCircle className="mr-2" />
              <p className="w-full overflow-hidden truncate whitespace-nowrap">
                {chat.pdfName}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Subscription Button */}
      <div className="absolute transform -translate-x-1/2 left-1/2 bottom-20 sm:bottom-16">
        <SubscriptionButton isPro={isPro} />
      </div>

      {/* Home and Source links */}
      <div className="absolute flex gap-6 text-lg transform -translate-x-1/2 sm:text-sm left-1/2 bottom-4 text-slate-500">
        <Link href="/">Home</Link>
        <Link href="/">Source</Link>
      </div>
    </div>
  );
};

export default ChatSideBar;
