import { NextResponse } from "next/server";
import connect from "@/db";
import Message from "@/models/Message";

export const POST = async (request) => {
  try {
    await connect();
    const { messageId } = await request.json();

    if (!messageId) {
      return new NextResponse("Missing messageId", { status: 400 });
    }

    const message = await Message.findById(messageId);

    if (!message) {
      return new NextResponse("Message not found", { status: 404 });
    }

    if (!message.read) {
      message.read = true;
      await message.save();
    }

    return new NextResponse(JSON.stringify(message), { status: 200 });
  } catch (error) {
    console.error("Error marking message as read:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
