import { NextResponse } from "next/server";
import { z } from "zod";
import { EmailTokenError, acceptInvitation } from "@/lib/auth/email-verification";

const Schema = z.object({
  token: z.string().min(1).max(200),
  password: z.string().min(1).max(500),
});

export async function POST(req: Request) {
  const parsed = Schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_payload", message: "Faltan datos." }, { status: 400 });
  }

  try {
    await acceptInvitation(parsed.data.token, parsed.data.password);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof EmailTokenError) {
      return NextResponse.json({ error: error.code, message: error.message }, { status: error.status });
    }
    console.error("[invitation] error al aceptar", error);
    return NextResponse.json(
      { error: "server_error", message: "No pudimos activar la cuenta. Probá de nuevo en unos minutos." },
      { status: 500 },
    );
  }
}
