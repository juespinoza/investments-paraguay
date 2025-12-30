import { NextResponse } from "next/server";

export async function POST() {
  const cookieName = process.env.AUTH_COOKIE_NAME || "ip_session";
  const res = NextResponse.json({ ok: true });
  res.cookies.set(cookieName, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
