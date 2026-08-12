import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getInmobiliariaById,
  InmobiliariaRepoError,
  InmobiliariaLandingInput,
  InmobiliariaSchema,
  softDeleteInmobiliaria,
  updateInmobiliaria,
  updateInmobiliariaCore,
  updateInmobiliariaLanding,
} from "@/lib/virtualoffice/inmobiliarias";
import { InmobiliariaCoreSchema } from "@/lib/virtualoffice/inmobiliaria-core";
import { InmobiliariaLandingThemeSchema } from "@/lib/virtualoffice/inmobiliaria-landing";

type Params = { params: Promise<{ id: string }> };

const InmobiliariaCorePayloadSchema = InmobiliariaCoreSchema.extend({
  mode: z.literal("core"),
});

const InmobiliariaLandingPayloadSchema = z.object({
  mode: z.literal("landing"),
  landing: InmobiliariaLandingThemeSchema.optional(),
});

const InmobiliariaFullPayloadSchema = InmobiliariaSchema.extend({
  mode: z.literal("full").optional(),
});

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

  try {
    if (body?.mode === "core") {
      const parsed = InmobiliariaCorePayloadSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { error: "Invalid payload", details: parsed.error.flatten() },
          { status: 400 },
        );
      }

      await updateInmobiliariaCore(id, parsed.data);
      return NextResponse.json({ ok: true, mode: "core" });
    }

    if (body?.mode === "landing") {
      const parsed = InmobiliariaLandingPayloadSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { error: "Invalid payload", details: parsed.error.flatten() },
          { status: 400 },
        );
      }

      await updateInmobiliariaLanding(
        id,
        parsed.data.landing as InmobiliariaLandingInput | undefined,
      );
      return NextResponse.json({ ok: true, mode: "landing" });
    }

    const parsed = InmobiliariaFullPayloadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

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
