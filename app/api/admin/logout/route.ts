import {
  NextResponse,
} from "next/server";
import {
  adminCookieName,
} from "../../../../lib/adminAuth";

export async function POST() {
  const response =
    NextResponse.json({
      success: true,
    });

  response.cookies.set(
    adminCookieName,
    "",
    {
      httpOnly: true,
      sameSite: "strict",
      secure:
        process.env.NODE_ENV ===
        "production",
      path: "/",
      maxAge: 0,
    }
  );

  return response;
}