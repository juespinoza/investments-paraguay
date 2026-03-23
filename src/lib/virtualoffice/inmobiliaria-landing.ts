import "server-only";

import { Prisma } from "@/generated/prisma";
import { z } from "zod";

export const InmobiliariaLandingThemeSchema = z.object({
  heroTitle: z.string().trim().nullable().optional(),
  heroSubtitle: z.string().trim().nullable().optional(),
  heroCtaLabel: z.string().trim().nullable().optional(),
  heroCtaHref: z.string().trim().nullable().optional(),
  heroBackgroundUrl: z.string().trim().nullable().optional(),
  contactTitle: z.string().trim().nullable().optional(),
  contactEmail: z.string().trim().nullable().optional(),
  contactPhone: z.string().trim().nullable().optional(),
  contactWhatsapp: z.string().trim().nullable().optional(),
  contactWebsite: z.string().trim().nullable().optional(),
  contactAddress: z.string().trim().nullable().optional(),
  advisorsTitle: z.string().trim().nullable().optional(),
  advisorsSubtitle: z.string().trim().nullable().optional(),
  propertiesTitle: z.string().trim().nullable().optional(),
  propertiesSubtitle: z.string().trim().nullable().optional(),
  featuredPropertyIds: z.array(z.string().trim()).max(6).optional().default([]),
});

export type InmobiliariaLandingTheme = z.output<
  typeof InmobiliariaLandingThemeSchema
>;

export function parseInmobiliariaLandingTheme(
  value: unknown,
): InmobiliariaLandingTheme | null {
  const parsed = InmobiliariaLandingThemeSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

export function buildInmobiliariaLandingJson(
  landing: InmobiliariaLandingTheme | undefined,
  featuredPropertyIds?: string[],
) {
  if (!landing) return Prisma.JsonNull;

  return {
    ...landing,
    featuredPropertyIds:
      featuredPropertyIds ?? landing.featuredPropertyIds ?? [],
  };
}
