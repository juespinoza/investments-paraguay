import { NextResponse } from "next/server";
import { z } from "zod";
import { ResetError, confirmPasswordReset } from "@/lib/auth/password-reset";

const ConfirmSchema = z.object({
  token: z.string().min(1).max(200),
  password: z.string().min(1).max(500),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = ConfirmSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_payload", message: "Faltan datos." },
      { status: 400 },
    );
  }

  try {
    await confirmPasswordReset(parsed.data.token, parsed.data.password);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof ResetError) {
      return NextResponse.json(
        { error: error.code, message: error.message },
        { status: error.status },
      );
    }
    console.error("[password-reset] error al confirmar", error);
    return NextResponse.json(
      { error: "server_error", message: "No pudimos cambiar la contraseña. Probá de nuevo en unos minutos." },
      { status: 500 },
    );
  }
}
