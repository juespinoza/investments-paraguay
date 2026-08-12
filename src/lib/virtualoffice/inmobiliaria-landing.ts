import "server-only";

import { Prisma } from "@/generated/prisma";
import type { PublicInmobiliariaLandingV2 } from "@/lib/data/types";
import { z } from "zod";

export const INMOBILIARIA_LANDING_LEGACY_FIELDS = [
  "contactTitle",
  "advisorsTitle",
  "advisorsSubtitle",
  "propertiesTitle",
  "propertiesSubtitle",
] as const;

export const InmobiliariaLandingV2Schema = z.object({
  heroTitle: z.string().trim().nullable().optional(),
  heroSubtitle: z.string().trim().nullable().optional(),
  heroImageUrl: z.string().trim().nullable().optional(),
  heroCtaLabel: z.string().trim().nullable().optional(),
  heroCtaHref: z.string().trim().nullable().optional(),
  aboutTitle: z.string().trim().nullable().optional(),
  aboutBody: z.string().trim().nullable().optional(),
  contactEmail: z.string().trim().nullable().optional(),
  contactPhone: z.string().trim().nullable().optional(),
  contactWhatsapp: z.string().trim().nullable().optional(),
  contactWebsite: z.string().trim().nullable().optional(),
  contactAddress: z.string().trim().nullable().optional(),
  advisorsIntro: z.string().trim().nullable().optional(),
  propertiesIntro: z.string().trim().nullable().optional(),
  featuredPropertyIds: z.array(z.string().trim()).max(6).optional().default([]),
});

export type InmobiliariaLandingV2 = z.output<
  typeof InmobiliariaLandingV2Schema
>;
export type InmobiliariaLandingV2FormData = InmobiliariaLandingV2;

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

export function normalizeInmobiliariaLandingToV2(input: {
  name?: string | null;
  slug?: string | null;
  logoUrl?: string | null;
  description?: string | null;
  landing?: InmobiliariaLandingTheme | null;
}): InmobiliariaLandingV2 {
  const landing = input.landing ?? null;

  return InmobiliariaLandingV2Schema.parse({
    heroTitle: landing?.heroTitle ?? input.name ?? null,
    heroSubtitle: landing?.heroSubtitle ?? input.description ?? null,
    heroImageUrl: landing?.heroBackgroundUrl ?? null,
    heroCtaLabel: landing?.heroCtaLabel ?? null,
    heroCtaHref: landing?.heroCtaHref ?? null,
    aboutTitle: "Sobre la inmobiliaria",
    aboutBody: input.description ?? null,
    contactEmail: landing?.contactEmail ?? null,
    contactPhone: landing?.contactPhone ?? null,
    contactWhatsapp: landing?.contactWhatsapp ?? null,
    contactWebsite: landing?.contactWebsite ?? null,
    contactAddress: landing?.contactAddress ?? null,
    advisorsIntro: landing?.advisorsSubtitle ?? null,
    propertiesIntro: landing?.propertiesSubtitle ?? null,
    featuredPropertyIds: landing?.featuredPropertyIds ?? [],
  });
}

export function mapInmobiliariaLandingToPublicV2(input: {
  name: string;
  slug: string;
  logoUrl?: string | null;
  description?: string | null;
  landing?: InmobiliariaLandingTheme | null;
}): PublicInmobiliariaLandingV2 {
  const normalized = normalizeInmobiliariaLandingToV2(input);

  return {
    slug: input.slug,
    name: input.name,
    logoUrl: input.logoUrl ?? null,
    hero: {
      title: normalized.heroTitle ?? input.name,
      subtitle: normalized.heroSubtitle ?? input.description ?? null,
      imageUrl: normalized.heroImageUrl ?? null,
      ctaLabel: normalized.heroCtaLabel ?? null,
      ctaHref: normalized.heroCtaHref ?? null,
    },
    about: {
      title: normalized.aboutTitle ?? null,
      body: normalized.aboutBody ?? null,
    },
    contact: {
      email: normalized.contactEmail ?? null,
      phone: normalized.contactPhone ?? null,
      whatsapp: normalized.contactWhatsapp ?? null,
      website: normalized.contactWebsite ?? null,
      address: normalized.contactAddress ?? null,
    },
    advisorsIntro: normalized.advisorsIntro ?? null,
    propertiesIntro: normalized.propertiesIntro ?? null,
    featuredPropertyIds: normalized.featuredPropertyIds ?? [],
  };
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
