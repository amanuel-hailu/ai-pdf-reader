import ChatSideBar from "@/components/ChatSideBar";
import PDFViewer from "@/components/PDFViewer";
import ChatComponent from "@/components/ChatComponent";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";
import { checkSubscription } from "@/lib/subscription";

type Props = {
  params: {
    chatId: string;
  };
};

const ChatPage = async ({ params: { chatId } }: Props) => {
  const { userId } = await auth();
  // If the user is not logged in, redirect to the login page

  if (!userId) {
    return redirect("/sign-in");
  }

  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));
  // If I don't have a chat or if the chat in the db is not the same as the chatId in the url, redirect "/"
  if (!_chats) {
    return redirect("/");
  }
  if (!_chats.find((chat) => chat.id === parseInt(chatId))) {
    return redirect("/");
  }

  const currentChat = _chats.find((chat) => chat.id === parseInt(chatId));
  const isPro = await checkSubscription();

  return (
    <div className="flex flex-col h-screen md:flex-row">
      {/* Chat sidebar */}
      <div className="w-full overflow-y-auto h-1/4 md:w-1/4 md:h-full">
        <ChatSideBar chats={_chats} chatId={parseInt(chatId)} isPro={isPro} />
      </div>

      {/* pdf viewer */}
      <div className="w-full p-4 overflow-y-auto h-1/2 md:w-1/2 md:h-full md:p-4">
        <PDFViewer pdf_url={currentChat?.pdfUrl || ""} />
      </div>

      {/* Chat component */}
      <div className="w-full overflow-y-auto border-l-4 h-1/4 md:w-1/4 md:h-full border-slate-200">
        <ChatComponent chatId={parseInt(chatId)} />
      </div>
    </div>
  );
};

export default ChatPage;
