import { NextResponse } from "next/server";
import connect from "@/db";
import User from "@/models/User";

export const PUT = async (request, { params }) => {
  try {
    await connect();

    const userID = params.id;
    const { about, profilePhoto } = await request.json();
    console.log(about,profilePhoto);

    if (!about) {
      return new NextResponse("No data provided", { status: 400 });
    }

    const user = await User.findByIdAndUpdate(
      userID,
      { about, profilePhoto },
      { new: true, runValidators: true }
    );

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    return new NextResponse(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};