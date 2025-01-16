import { NextResponse } from "next/server";
import connect from "@/db";
import Message from "@/models/Message";

export const POST = async (request) => {
  try {
    await connect();

    const { senderId, receiverId, content } = await request.json();
    console.log(senderId, receiverId, content);

    if (!senderId || !receiverId || !content) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const message = new Message({
      sender: senderId,
      receiver: receiverId,
      content,
    });

    await message.save();

    return new NextResponse(JSON.stringify(message), { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
