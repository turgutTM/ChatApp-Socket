import { NextResponse } from "next/server";
import connect from "@/db";
import User from "@/models/User";

export const POST = async (request) => {
  try {
    await connect();

    const { userId, friendId } = await request.json();

    console.log("userId:", userId);
    console.log("friendId:", friendId);

    if (!userId || !friendId) {
      return new NextResponse(
        JSON.stringify({ message: "Both userId and friendId are required" }),
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    if (
      friend.friendRequests.includes(userId) ||
      friend.friends.includes(userId)
    ) {
      return new NextResponse(
        JSON.stringify({
          message: "Friend request already sent or user already a friend",
        }),
        { status: 400 }
      );
    }

    friend.friendRequests.push(userId);
    await friend.save();

    return new NextResponse(
      JSON.stringify({ message: "Friend request sent" }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
};
