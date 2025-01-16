import { NextResponse } from "next/server";
import connect from "@/db";
import User from "@/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const POST = async (request) => {
  await connect();
  const { email, password } = await request.json();

  if (!email || !password) {
    return new NextResponse(
      JSON.stringify({ message: "All fields are required" }),
      { status: 400 }
    );
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid email or password" }),
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid email or password" }),
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const { password: _, ...userWithoutPassword } = user._doc;

    const response = new NextResponse(
      JSON.stringify({ ...userWithoutPassword, token }),
      {
        status: 200,
      }
    );

    const oneDay = 1000 * 60 * 60 * 24;

    response.cookies.set("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + oneDay),
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
};
