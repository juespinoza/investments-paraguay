import { NextResponse } from "next/server";
import { z } from "zod";
import { createLead } from "@/lib/leads/repo";
import { evaluateLead } from "@/lib/leads/spam";
import { clientIp, isRateLimited } from "@/lib/leads/rate-limit";

const CreateLeadSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email().optional().or(z.literal("")),
  whatsapp: z.string().min(6).optional().or(z.literal("")),
  sourcePage: z.string().optional(),
  advisorSlug: z.string().optional(),
  propertySlug: z.string().optional(),
  notes: z.string().optional(),
  _hp: z.string().optional(),
  _elapsed: z.number().optional(),
});

// Respuesta igual a la de un lead guardado, para que el bot no sepa que
// fue descartado.
function fakeSuccess() {
  return NextResponse.json({ ok: true, id: 0 }, { status: 201 });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = CreateLeadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;

  if (!data.email && !data.whatsapp) {
    return NextResponse.json(
      { error: "Email o WhatsApp es requerido" },
      { status: 400 },
    );
  }

  if (isRateLimited(clientIp(req))) {
    return NextResponse.json(
      { error: "Demasiados envíos. Probá de nuevo en unos minutos." },
      { status: 429 },
    );
  }

  const verdict = evaluateLead({
    fullName: data.fullName,
    email: data.email,
    guard: { _hp: data._hp, _elapsed: data._elapsed },
  });

  if (verdict.kind === "drop") {
    console.info(`[leads] descartado: ${verdict.reason}`);
    return fakeSuccess();
  }

  const notes = data.notes?.trim() || null;
  const id = await createLead({
    fullName: data.fullName.trim(),
    email: data.email?.trim() || null,
    whatsapp: data.whatsapp?.trim() || null,
    sourcePage: data.sourcePage?.trim() || null,
    advisorSlug: data.advisorSlug?.trim() || null,
    propertySlug: data.propertySlug?.trim() || null,
    notes:
      verdict.kind === "suspicious"
        ? [`[Spam probable: ${verdict.reason}]`, notes]
            .filter(Boolean)
            .join("\n\n")
        : notes,
    status: verdict.kind === "suspicious" ? "LOST" : "NEW",
  });

  return NextResponse.json({ ok: true, id }, { status: 201 });
}
