import { NextResponse } from "next/server";

export async function POST() {
  const cookieName = process.env.AUTH_COOKIE_NAME || "ip_session";
  const secure = (process.env.AUTH_COOKIE_SECURE ?? "true") === "true";
  const response = NextResponse.json({ ok: true });

  response.cookies.set(cookieName, "", {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
    maxAge: 0,
  });

  return response;
}
