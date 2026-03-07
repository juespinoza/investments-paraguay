import { NextResponse } from "next/server";
import { z } from "zod";
import { createLead } from "@/lib/leads/repo";

const CreateLeadSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email().optional().or(z.literal("")),
  whatsapp: z.string().min(6).optional().or(z.literal("")),
  sourcePage: z.string().optional(),
  advisorSlug: z.string().optional(),
  propertySlug: z.string().optional(),
  notes: z.string().optional(),
});

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

  const id = await createLead({
    fullName: data.fullName.trim(),
    email: data.email?.trim() || null,
    whatsapp: data.whatsapp?.trim() || null,
    sourcePage: data.sourcePage?.trim() || null,
    advisorSlug: data.advisorSlug?.trim() || null,
    propertySlug: data.propertySlug?.trim() || null,
    notes: data.notes?.trim() || null,
  });

  return NextResponse.json({ ok: true, id }, { status: 201 });
}
