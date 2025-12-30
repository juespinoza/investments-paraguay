import "server-only";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export type SessionPayload = {
  sub: string; // userId
  email: string;
  role: "ADMIN" | "INMOBILIARIA" | "ASESOR" | "BLOGUERO";
};

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
    return {
      sub: String(payload.sub ?? ""),
      email: String(payload.email ?? ""),
      role: payload.role as SessionPayload["role"],
    };
  } catch {
    return null;
  }
}
