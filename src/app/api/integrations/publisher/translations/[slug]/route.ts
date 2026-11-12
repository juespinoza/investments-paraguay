import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePublicProperties } from "@/lib/cache/revalidate";
import {
  hashSource,
  loadSource,
  TranslatedContentSchema,
} from "@/lib/properties/translate";
import { TRANSLATED_LOCALES } from "@/lib/properties/translate-locales";
import { authorize, errorResponse } from "@/lib/publisher/http";

// Traducciones cargadas a mano (sin ANTHROPIC_API_KEY).
// GET: texto en español a traducir y traducciones existentes.
// PUT: guarda la traducción de un idioma como REVIEWED; la traducción
// automática nunca la pisa.
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

const ManualTranslationSchema = TranslatedContentSchema.extend({
  locale: z.enum(TRANSLATED_LOCALES),
  title: z.string().trim().min(3).max(200),
  businessOptions: TranslatedContentSchema.shape.businessOptions.optional(),
}).strict();

async function findProperty(params: Params["params"]) {
  const { slug } = await params;
  return prisma.property.findFirst({
    where: { slug: decodeURIComponent(slug), deletedAt: null },
    select: { id: true, slug: true },
  });
}

export async function GET(req: Request, { params }: Params) {
  const denied = authorize(req, "content");
  if (denied) return denied;
  const property = await findProperty(params);
  if (!property) return errorResponse(404, "not_found", "No existe una propiedad con ese slug.");

  const loaded = await loadSource(property.id);
  const translations = await prisma.propertyTranslation.findMany({
    where: { propertyId: property.id },
  });
  const hash = loaded ? hashSource(loaded.source) : null;

  return NextResponse.json({
    slug: property.slug,
    source: loaded?.source ?? null,
    translations: translations.map((item) => ({
      ...item,
      stale: item.sourceHash !== hash,
    })),
  });
}

export async function PUT(req: Request, { params }: Params) {
  const denied = authorize(req, "content");
  if (denied) return denied;
  const property = await findProperty(params);
  if (!property) return errorResponse(404, "not_found", "No existe una propiedad con ese slug.");

  const body = await req.json().catch(() => null);
  const parsed = ManualTranslationSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(422, "invalid_payload", "El cuerpo no cumple el contrato.", parsed.error.flatten());
  }

  const loaded = await loadSource(property.id);
  if (!loaded) return errorResponse(404, "not_found", "No existe una propiedad con ese slug.");

  const { locale, ...content } = parsed.data;
  const data = {
    title: content.title,
    description: content.description,
    summary: content.summary,
    zoneSummary: content.zoneSummary,
    risks: content.risks,
    methodology: content.methodology,
    businessOptions: content.businessOptions ?? [],
    status: "REVIEWED" as const,
    sourceHash: hashSource(loaded.source),
    model: "manual",
  };

  const saved = await prisma.propertyTranslation.upsert({
    where: { propertyId_locale: { propertyId: property.id, locale } },
    create: { propertyId: property.id, locale, ...data },
    update: data,
  });

  revalidatePublicProperties();
  return NextResponse.json({ translation: saved });
}
