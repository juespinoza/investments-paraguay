import { z } from "zod";
import { PUBLISHER_ALLOWED_UPDATE_STATUSES } from "@/lib/publisher/core";

const nullableText = (max: number) =>
  z.string().trim().max(max).nullable().optional();

// Contrato de la API del publicador (src/lib/publisher/README.md).
// Campo omitido = no se toca. null = se borra el valor guardado.
export const PublisherPropertySchema = z
  .object({
    title: z.string().trim().min(3).max(160),
    description: nullableText(20000),
    propertyTypeCode: z
      .string()
      .trim()
      .toUpperCase()
      .regex(/^[A-Z0-9_]+$/)
      .optional(),
    price: z.number().positive().max(1e12).nullable().optional(),
    currency: z.enum(["USD", "GS"]).optional(),
    city: nullableText(120),
    neighborhood: nullableText(120),
    address: nullableText(240),
    locationUrl: z.string().trim().url().max(500).nullable().optional(),
    latitude: z.number().min(-90).max(90).nullable().optional(),
    longitude: z.number().min(-180).max(180).nullable().optional(),
    areaM2: z.number().positive().max(1e7).nullable().optional(),
    roiAnnualPct: z.number().min(0).max(100).nullable().optional(),
    appreciationAnnualPct: z.number().min(0).max(100).nullable().optional(),
    hasPropertyDocuments: z.boolean().optional(),
    images: z.array(z.string().trim().url()).max(30).optional(),
    categories: z.array(z.enum(["CONOCER", "VIVIR", "INVERTIR"])).optional(),
    advisorSlug: z.string().trim().min(1).max(120).nullable().optional(),
    status: z.enum(PUBLISHER_ALLOWED_UPDATE_STATUSES).optional(),
  })
  .strict();

export type PublisherPropertyInput = z.infer<typeof PublisherPropertySchema>;
