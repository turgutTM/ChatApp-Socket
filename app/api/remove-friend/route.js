import { NextResponse } from "next/server";
import connect from "@/db";
import User from "@/models/User";

export const DELETE = async (request) => {
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
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    user.friends = user.friends.filter(
      (id) => id.toString() !== friendId.toString()
    );
    friend.friends = friend.friends.filter(
      (id) => id.toString() !== userId.toString()
    );

    await user.save();
    await friend.save();

    return new NextResponse(
      JSON.stringify({ message: "Friend removed successfully" }),
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
