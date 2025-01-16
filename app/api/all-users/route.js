import { NextResponse } from "next/server";
import connect from "@/db";
import User from "@/models/User";

export const GET = async (request) => {
  try {
    await connect();

    const users = await User.find();

    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
