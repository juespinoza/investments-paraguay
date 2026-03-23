import "server-only";

import { z } from "zod";

export const InmobiliariaCoreSchema = z.object({
  name: z.string().trim().min(2),
  slug: z.string().trim().min(2),
  description: z.string().trim().nullable().optional(),
  logoUrl: z.string().trim().nullable().optional(),
});

export type InmobiliariaCoreInput = z.output<typeof InmobiliariaCoreSchema>;

export function buildInmobiliariaCoreCreateData(input: InmobiliariaCoreInput) {
  return {
    name: input.name,
    slug: input.slug,
    description: input.description ?? null,
    logoUrl: input.logoUrl ?? null,
  };
}

export function buildInmobiliariaCoreUpdateData(input: InmobiliariaCoreInput) {
  return buildInmobiliariaCoreCreateData(input);
}
