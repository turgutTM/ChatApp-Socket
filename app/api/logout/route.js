import { NextResponse } from "next/server";

export const POST = async () => {
  try {
    const response = new NextResponse(
      JSON.stringify({ message: "Logout successful" }),
      {
        status: 200,
      }
    );

    response.cookies.set("token", "logout", {
      httpOnly: true,
      expires: new Date(0),
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
};
