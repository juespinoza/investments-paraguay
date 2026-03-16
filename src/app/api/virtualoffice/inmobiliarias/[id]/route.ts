import { NextResponse } from "next/server";
import {
  getInmobiliariaById,
  InmobiliariaRepoError,
  InmobiliariaSchema,
  softDeleteInmobiliaria,
  updateInmobiliaria,
} from "@/lib/virtualoffice/inmobiliarias";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;

  try {
    const inmobiliaria = await getInmobiliariaById(id);
    if (!inmobiliaria) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(inmobiliaria);
  } catch (error) {
    if (error instanceof InmobiliariaRepoError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Get failed" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: Params) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = InmobiliariaSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    await updateInmobiliaria(id, parsed.data);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof InmobiliariaRepoError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params;

  try {
    await softDeleteInmobiliaria(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof InmobiliariaRepoError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
