import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createInmobiliaria,
  InmobiliariaRepoError,
  InmobiliariaSchema,
  listInmobiliarias,
} from "@/lib/virtualoffice/inmobiliarias";

const InmobiliariaWorkflowSchema = InmobiliariaSchema.extend({
  user: z
    .object({
      email: z.string().email(),
      password: z.string().min(8),
      name: z.string().trim().optional().nullable(),
    })
    .optional(),
});

export async function GET() {
  try {
    const items = await listInmobiliarias();
    return NextResponse.json({ items });
  } catch (error) {
    if (error instanceof InmobiliariaRepoError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "List failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = InmobiliariaWorkflowSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const created = await createInmobiliaria(parsed.data, parsed.data.user);
    return NextResponse.json({ id: created.id }, { status: 201 });
  } catch (error) {
    if (error instanceof InmobiliariaRepoError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}
