import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { prisma } from "@/lib/prisma";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

function getSecret() {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("Missing AUTH_SECRET");
  return new TextEncoder().encode(s);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase().trim();

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      password: true,
      role: true,
      inmobiliariaId: true,
      advisorId: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const ok = await bcrypt.compare(parsed.data.password, user.password);
  if (!ok) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await new SignJWT({
    id: user.id,
    sub: user.id,
    email: user.email,
    role: user.role,
    inmobiliariaId: user.inmobiliariaId ?? null,
    advisorId: user.advisorId ?? null,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());

  const cookieName = process.env.AUTH_COOKIE_NAME || "ip_session";
  const secure = (process.env.AUTH_COOKIE_SECURE ?? "true") === "true";

  const res = NextResponse.json({ ok: true });
  res.cookies.set(cookieName, token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
