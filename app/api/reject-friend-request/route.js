import { NextResponse } from "next/server";
import connect from "@/db";
import User from "@/models/User";

export const POST = async (request) => {
  try {
    await connect();

    const { userId, friendId } = await request.json();

    if (!userId || !friendId) {
      return new NextResponse(
        JSON.stringify({ message: "Both userId and friendId are required" }),
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return new NextResponse(
        JSON.stringify({ message: "User or friend not found" }),
        { status: 404 }
      );
    }

    if (!user.friendRequests.includes(friendId)) {
      return new NextResponse(
        JSON.stringify({ message: "No friend request from this user" }),
        { status: 400 }
      );
    }

    user.friendRequests = user.friendRequests.filter(
      (id) => id.toString() !== friendId
    );
    await user.save();

    friend.friendRequests = friend.friendRequests.filter(
      (id) => id.toString() !== userId
    );
    await friend.save();

    return new NextResponse(
      JSON.stringify({ message: "Friend request rejected" }),
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
