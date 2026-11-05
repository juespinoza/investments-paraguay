import { NextResponse } from "next/server";
import { z } from "zod";
import { requestPasswordReset } from "@/lib/auth/password-reset";

const RequestSchema = z.object({ email: z.string().trim().email().max(254) });

// Siempre responde lo mismo, exista o no la cuenta, para no revelar qué
// emails están registrados.
const GENERIC = {
  ok: true,
  message:
    "Si el email corresponde a una cuenta, te enviamos un link para restablecer la contraseña.",
};

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_email", message: "Ingresá un email válido." },
      { status: 400 },
    );
  }

  try {
    const result = await requestPasswordReset(parsed.data.email);
    if (result !== "sent") {
      console.warn(`[password-reset] pedido no enviado: ${result}`);
    }
    return NextResponse.json(GENERIC);
  } catch (error) {
    console.error("[password-reset] error al procesar el pedido", error);
    return NextResponse.json(
      { error: "server_error", message: "No pudimos procesar el pedido. Probá de nuevo en unos minutos." },
      { status: 500 },
    );
  }
}
