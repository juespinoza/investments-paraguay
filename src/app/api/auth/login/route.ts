import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { prisma } from "@/lib/prisma";

// Sin mínimo de largo acá: una contraseña corta es simplemente incorrecta.
const LoginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1).max(500),
});

const DUMMY_HASH = "$2b$12$LPbxMhd8/yNg0e32F8Zo6eI1WvfXTRVllFkM4IKiLVCVKKGyGPTc2";

// Códigos que el formulario traduce a mensajes distintos.
function fail(status: number, error: string) {
  return NextResponse.json({ error }, { status });
}

function getSecret() {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("Missing AUTH_SECRET");
  return new TextEncoder().encode(s);
}

export async function POST(req: Request) {
  try {
    return await login(req);
  } catch (error) {
    // Configuración faltante (AUTH_SECRET), base caída, etc. No es un
    // problema de la contraseña y el formulario lo muestra distinto.
    console.error("[auth/login] error del servidor", error);
    return fail(500, "server_error");
  }
}

async function login(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) {
    return fail(400, "invalid_payload");
  }

  // Se valida antes de tocar la base para detectar la falta de configuración
  // aunque la contraseña sea incorrecta.
  const secret = getSecret();

  const email = parsed.data.email.toLowerCase().trim();

  const user = await prisma.user.findFirst({
    where: {
      email,
      deletedAt: null,
    },
    select: {
      id: true,
      email: true,
      password: true,
      role: true,
      inmobiliariaId: true,
      advisorId: true,
      emailVerifiedAt: true,
    },
  });

  if (!user) {
    // Misma demora que con un usuario real, para no revelar qué emails existen.
    await bcrypt.compare(parsed.data.password, DUMMY_HASH);
    return fail(401, "invalid_credentials");
  }

  const ok = await bcrypt.compare(parsed.data.password, user.password);
  if (!ok) {
    return fail(401, "invalid_credentials");
  }

  // Cuenta creada por invitación que todavía no confirmó su email.
  if (!user.emailVerifiedAt) {
    return fail(403, "account_not_activated");
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
    .sign(secret);

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
