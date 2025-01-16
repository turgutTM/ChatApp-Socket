import { NextResponse } from "next/server";
import connect from "@/db";
import User from "@/models/User";

export const GET = async (request) => {
  try {
    await connect();

    const userId = request.nextUrl.pathname.split("/").pop();

    if (!userId) {
      return new NextResponse(
        JSON.stringify({ message: "userId is required" }),
        { status: 400 }
      );
    }

    const user = await User.findById(userId).populate({
      path: "friends",
      select: "name profilePhoto surname",
      options: { lean: true },
    });

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    const friends = user.friends;

    return new NextResponse(JSON.stringify({ friends }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
};
