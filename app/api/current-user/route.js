import { NextResponse } from "next/server";
import connect from "@/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export const dynamic = 'force-dynamic';
export const GET = async (request) => {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new NextResponse(
        JSON.stringify({ message: "No token provided" }),
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return new NextResponse(JSON.stringify({ message: "Invalid token" }), {
        status: 401,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await connect();

    const user = await User.findById(decoded.id);

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    const { password, ...userWithoutPassword } = user._doc;

    return new NextResponse(JSON.stringify(userWithoutPassword), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
};
