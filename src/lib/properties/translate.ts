import "server-only";
// Traducción de propiedades a EN y PT.
//
// HOY (noviembre 2026): la traducción automática está APAGADA porque no hay
// ANTHROPIC_API_KEY con créditos. Las traducciones se cargan a mano con
// PUT /api/integrations/publisher/translations/{slug} (estado REVIEWED).
// GET /api/integrations/publisher/translations lista qué falta traducir.
//
// PARA ACTIVARLA MÁS ADELANTE (sin tocar código):
// 1. platform.claude.com → Agregar fondos (la API es prepaga: cada llamada
//    se descuenta del saldo; con saldo 0 las llamadas fallan).
// 2. Claves y acceso → Crear clave → "Continuar con una clave de API" (la
//    federación de identidades no aplica: Vercel no es un proveedor admitido).
// 3. Vercel → Settings → Environment Variables: ANTHROPIC_API_KEY en
//    Production y Preview. Redeploy.
// 4. POST /api/integrations/publisher/translations?limit=8 hasta que
//    devuelva translated: 0. Desde ahí cada alta o edición se traduce sola.
// Las traducciones REVIEWED (cargadas a mano) nunca se pisan.
import { createHash } from "node:crypto";
import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePublicProperties } from "@/lib/cache/revalidate";
import { formatPropertyTitle } from "@/lib/properties/text";
import { parseBusinessOptions } from "@/lib/properties/strategy";

import {
  TRANSLATED_LOCALES,
  type TranslatedLocale,
} from "@/lib/properties/translate-locales";

const MODEL = "claude-opus-5-5";

export const TranslatedContentSchema = z.object({
  title: z.string(),
  description: z.string().nullable(),
  summary: z.string().nullable(),
  zoneSummary: z.string().nullable(),
  risks: z.string().nullable(),
  methodology: z.string().nullable(),
  businessOptions: z.array(
    z.object({ title: z.string(), description: z.string() }),
  ),
});

const TranslationResponseSchema = z.object({
  en: TranslatedContentSchema,
  pt: TranslatedContentSchema,
});

export type SourceContent = z.infer<typeof TranslatedContentSchema>;

const SYSTEM_PROMPT = `You translate real-estate investment listings published by Investments Paraguay from Spanish (Paraguay) into English and Brazilian Portuguese.

The readers are foreign investors evaluating a purchase in Paraguay. Write the way a professional investment advisor would: clear, precise and neutral, without sales hype.

Rules:
- Translate the meaning faithfully. Do not add, remove or embellish facts, numbers, prices, areas or dates.
- Keep proper names as they are: neighborhoods, cities, streets, building and development names (for example Villa Morra, Luque, Mariano Roque Alonso).
- Keep the source formatting: line breaks, paragraph breaks, "- " bullets and **bold** markers. Drop emojis.
- Currency codes stay as written (USD, Gs.). Keep numbers exactly; you may adapt only the thousands and decimal separators to each language.
- Write the title in title case for English and sentence case for Portuguese, with no capital-letter shouting.
- Return null for a field whose source is null, and an empty list when there are no business options.`;

export function hashSource(source: SourceContent) {
  return createHash("sha256").update(JSON.stringify(source)).digest("hex");
}

// Texto en español que se traduce, con las traducciones existentes.
export async function loadSource(propertyId: string) {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    select: {
      title: true,
      description: true,
      strategy: {
        select: {
          summary: true,
          zoneSummary: true,
          risks: true,
          methodology: true,
          businessOptions: true,
        },
      },
      translations: {
        select: { locale: true, sourceHash: true, status: true },
      },
    },
  });

  if (!property) return null;

  const source: SourceContent = {
    title: formatPropertyTitle(property.title),
    description: property.description?.trim() || null,
    summary: property.strategy?.summary?.trim() || null,
    zoneSummary: property.strategy?.zoneSummary?.trim() || null,
    risks: property.strategy?.risks?.trim() || null,
    methodology: property.strategy?.methodology?.trim() || null,
    businessOptions: parseBusinessOptions(property.strategy?.businessOptions),
  };

  return { source, translations: property.translations };
}

export type TranslationResult =
  | { status: "translated"; locales: TranslatedLocale[] }
  | { status: "up_to_date" }
  | { status: "skipped"; reason: string };

// Traduce título, descripción y textos de la estrategia a EN y PT.
// Se puede llamar en cada guardado: si el texto en español no cambió, no
// llama al modelo; una traducción marcada como REVIEWED nunca se pisa.
export async function translateProperty(
  propertyId: string,
): Promise<TranslationResult> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return { status: "skipped", reason: "ANTHROPIC_API_KEY no configurada" };
  }

  const loaded = await loadSource(propertyId);
  if (!loaded) return { status: "skipped", reason: "propiedad inexistente" };

  const { source, translations } = loaded;
  const sourceHash = hashSource(source);
  const pending = TRANSLATED_LOCALES.filter((locale) => {
    const current = translations.find((item) => item.locale === locale);
    if (!current) return true;
    return current.status === "AUTO" && current.sourceHash !== sourceHash;
  });

  if (!pending.length) return { status: "up_to_date" };

  const client = new Anthropic();
  const response = await client.beta.messages.parse({
    model: MODEL,
    max_tokens: 16000,
    // Si el modelo rechaza el pedido, el servidor lo reintenta con el
    // modelo de respaldo que corresponda.
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Translate this listing into English (en) and Brazilian Portuguese (pt).\n\n${JSON.stringify(source, null, 2)}`,
      },
    ],
    output_config: {
      effort: "medium",
      format: betaZodOutputFormat(TranslationResponseSchema),
    },
  });

  if (response.stop_reason === "refusal") {
    return { status: "skipped", reason: "el modelo rechazó la traducción" };
  }

  const parsed = response.parsed_output;
  if (!parsed) {
    return { status: "skipped", reason: "respuesta sin formato válido" };
  }

  for (const locale of pending) {
    const content = parsed[locale];
    const data = {
      title: content.title.trim() || source.title,
      description: source.description ? content.description : null,
      summary: source.summary ? content.summary : null,
      zoneSummary: source.zoneSummary ? content.zoneSummary : null,
      risks: source.risks ? content.risks : null,
      methodology: source.methodology ? content.methodology : null,
      businessOptions: content.businessOptions,
      status: "AUTO" as const,
      sourceHash,
      model: response.model,
    };

    await prisma.propertyTranslation.upsert({
      where: { propertyId_locale: { propertyId, locale } },
      create: { propertyId, locale, ...data },
      update: data,
    });
  }

  revalidatePublicProperties();
  return { status: "translated", locales: pending };
}

// Para usar con after(): traduce sin bloquear la respuesta y sin romper el
// guardado si la traducción falla.
export async function translatePropertyInBackground(propertyId: string) {
  try {
    const result = await translateProperty(propertyId);
    if (result.status === "skipped") {
      console.info(`[translate] ${propertyId}: ${result.reason}`);
    }
  } catch (error) {
    console.error(`[translate] ${propertyId}: falló la traducción`, error);
  }
}
