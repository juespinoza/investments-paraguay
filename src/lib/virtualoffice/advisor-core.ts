import "server-only";

export type AdvisorCoreInput = {
  fullName: string;
  slug: string;
  headline?: string | null;
  heroBgUrl?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  inmobiliariaId?: string | null;
};

export function buildAdvisorCoreCreateData(input: AdvisorCoreInput) {
  return {
    fullName: input.fullName,
    slug: input.slug,
    headline: input.headline ?? null,
    heroBgUrl: input.heroBgUrl ?? null,
    ctaLabel: input.ctaLabel ?? "Contactar",
    ctaHref: input.ctaHref ?? "#",
    inmobiliariaId: input.inmobiliariaId ?? null,
  };
}

export function buildAdvisorCoreUpdateData(input: AdvisorCoreInput) {
  return {
    fullName: input.fullName,
    slug: input.slug,
    headline: input.headline ?? null,
    heroBgUrl: input.heroBgUrl ?? null,
    ctaLabel: input.ctaLabel ?? null,
    ctaHref: input.ctaHref ?? null,
    inmobiliariaId: input.inmobiliariaId ?? null,
  };
}
