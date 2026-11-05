import { NextResponse } from "next/server";
import { z } from "zod";
import { EmailTokenError, confirmEmailChange } from "@/lib/auth/email-verification";

const Schema = z.object({ token: z.string().min(1).max(200) });

// POST y no GET: los antivirus de correo abren los links de los emails para
// revisarlos, y eso no debe alcanzar para confirmar el cambio.
export async function POST(req: Request) {
  const parsed = Schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_payload", message: "Faltan datos." }, { status: 400 });
  }

  try {
    await confirmEmailChange(parsed.data.token);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof EmailTokenError) {
      return NextResponse.json({ error: error.code, message: error.message }, { status: error.status });
    }
    console.error("[email-change] error al confirmar", error);
    return NextResponse.json(
      { error: "server_error", message: "No pudimos confirmar el email. Probá de nuevo en unos minutos." },
      { status: 500 },
    );
  }
}
