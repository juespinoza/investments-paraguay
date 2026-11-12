import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { HIDDEN_PUBLIC_STATUSES } from "@/lib/properties/public";
import {
  hashSource,
  loadSource,
  translateProperty,
} from "@/lib/properties/translate";
import { TRANSLATED_LOCALES } from "@/lib/properties/translate-locales";
import { authorize } from "@/lib/publisher/http";

// Traduce las propiedades publicadas que todavía no tienen traducción (o
// cuyo texto en español cambió). Pensado para correr una vez tras configurar
// ANTHROPIC_API_KEY; procesa de a tandas para no superar el tiempo máximo.
// POST /api/integrations/publisher/translations?limit=8
export const dynamic = "force-dynamic";
export const maxDuration = 300;

// Lista las propiedades publicadas a las que les falta una traducción o
// cuya traducción quedó vieja porque cambió el texto en español.
// No necesita ANTHROPIC_API_KEY.
export async function GET(req: Request) {
  const denied = authorize(req);
  if (denied) return denied;

  const properties = await prisma.property.findMany({
    where: { deletedAt: null, status: { notIn: [...HIDDEN_PUBLIC_STATUSES] } },
    select: { id: true, slug: true },
    orderBy: { updatedAt: "desc" },
  });

  const pending: Array<{ slug: string; missing: string[]; stale: string[] }> = [];
  for (const property of properties) {
    const loaded = await loadSource(property.id);
    if (!loaded) continue;
    const hash = hashSource(loaded.source);
    const missing = TRANSLATED_LOCALES.filter(
      (locale) => !loaded.translations.some((item) => item.locale === locale),
    );
    const stale = TRANSLATED_LOCALES.filter((locale) =>
      loaded.translations.some(
        (item) => item.locale === locale && item.sourceHash !== hash,
      ),
    );
    if (missing.length || stale.length) {
      pending.push({ slug: property.slug, missing, stale });
    }
  }

  return NextResponse.json({ total: properties.length, pending });
}

// Traducción automática con Claude (requiere ANTHROPIC_API_KEY con saldo).
export async function POST(req: Request) {
  const denied = authorize(req);
  if (denied) return denied;

  const url = new URL(req.url);
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit") ?? 8), 1), 20);

  const properties = await prisma.property.findMany({
    where: { deletedAt: null, status: { notIn: [...HIDDEN_PUBLIC_STATUSES] } },
    select: { id: true, slug: true },
    orderBy: { updatedAt: "desc" },
  });

  const results: Array<{ slug: string; status: string; detail?: string }> = [];
  let translated = 0;

  for (const property of properties) {
    if (translated >= limit) break;
    try {
      const result = await translateProperty(property.id);
      if (result.status === "translated") translated += 1;
      if (result.status !== "up_to_date") {
        results.push({
          slug: property.slug,
          status: result.status,
          ...(result.status === "skipped" ? { detail: result.reason } : {}),
        });
      }
      if (result.status === "skipped" && result.reason.includes("ANTHROPIC_API_KEY")) break;
    } catch (error) {
      console.error("[translations]", property.slug, error);
      results.push({ slug: property.slug, status: "error" });
    }
  }

  return NextResponse.json({ translated, results });
}
