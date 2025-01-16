// ./app/api/get-message/route.js

import { NextResponse } from "next/server";
import connect from "@/db";
import Message from "@/models/Message";


export const dynamic = 'force-dynamic';

export const GET = async (request) => {
  try {
    await connect();

    const url = new URL(request.url);
    const senderId = url.searchParams.get("senderId");
    const receiverId = url.searchParams.get("receiverId");

    if (!senderId || !receiverId) {
      return new NextResponse(
        JSON.stringify({ error: "senderId and receiverId are required" }),
        { status: 400 }
      );
    }

    const lastMessage = await Message.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    })
      .sort({ timestamp: -1 })
      .select("timestamp content")
      .exec();

    if (!lastMessage) {
      return new NextResponse(
        JSON.stringify({ error: "No messages found between these users" }),
        { status: 404 }
      );
    }

    return new NextResponse(
      JSON.stringify({
        lastMessageTime: lastMessage.timestamp,
        lastMessageContent: lastMessage.content,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
