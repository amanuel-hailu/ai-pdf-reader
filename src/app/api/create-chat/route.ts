import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { loadS3IntoPinecone } from "@/lib/pinecone";
import { getS3URL } from "@/lib/s3";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// /api/create-chat
export async function POST(req: Request, res: Response) {
  let userId;
  try {
    const authResult = await auth();
    userId = authResult.userId;
    if (!userId) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { error: "authentication error" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { file_key, file_name } = body;
    console.log("file_key:", file_key);
    console.log("file_name:", file_name);
    await loadS3IntoPinecone(file_key);

    let s3Url;
    try {
      s3Url = getS3URL(file_key);
      // console log info for debugging
      console.log("s3Url:", s3Url);
    } catch (s3Error) {
      console.error("Error getting S3 URL:", s3Error);
      throw s3Error; // re-throw to be caught by the outer catch block
    }

    const chat_id = await db
      .insert(chats)
      .values({
        fileKey: file_key,
        pdfName: file_name,
        pdfUrl: s3Url,
        userId,
      })
      .returning({
        insertedId: chats.id,
      });

    return NextResponse.json(
      {
        chat_id: chat_id[0].insertedId,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}
