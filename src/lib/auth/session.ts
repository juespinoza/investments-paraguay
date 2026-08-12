import "server-only";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";
import { SessionPayload } from "../data/types";

function getSecret() {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("Missing AUTH_SECRET");
  return new TextEncoder().encode(s);
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieName = process.env.AUTH_COOKIE_NAME || "ip_session";
  const token = (await cookies()).get(cookieName)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    const userId = String(payload.sub ?? payload.id ?? "");
    if (!userId) return null;

    const user = await prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
      select: {
        id: true,
        email: true,
        role: true,
        inmobiliariaId: true,
        advisorId: true,
      },
    });

    if (!user) return null;

    return {
      id: user.id,
      sub: user.id,
      email: user.email,
      role: user.role as SessionPayload["role"],
      inmobiliariaId: user.inmobiliariaId ? String(user.inmobiliariaId) : null,
      advisorId: user.advisorId ? String(user.advisorId) : null,
    };
  } catch {
    return null;
  }
}
