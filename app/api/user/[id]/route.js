import { NextResponse } from "next/server";
import connect from "@/db";
import User from "@/models/User";

export const GET = async (request, { params }) => {
  try {
    await connect();
    const { id } = params;
    const user = await User.findById(id);

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    return new NextResponse(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
