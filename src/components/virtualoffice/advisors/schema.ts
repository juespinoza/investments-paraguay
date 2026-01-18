import { z } from "zod";
import { SocialPlatform } from "@/generated/prisma";
import { slugify } from "./utils";

export const SocialPlatformSchema = z.enum(SocialPlatform);

export const FormSchema = z.object({
  fullName: z.string().min(3, "Full name required"),
  slug: z
    .string()
    .min(3)
    .transform((v) => slugify(v))
    .refine((v) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(v), "Invalid slug"),
  headline: z.string().optional().nullable(),
  heroBgUrl: z.string().optional().nullable(),
  ctaLabel: z.string().optional().nullable(),
  ctaHref: z.string().optional().nullable(),

  // si admin: puede reasignar inmobiliaria
  inmobiliariaId: z.string().optional().nullable(),

  landing: z.object({
    aboutImageUrl: z.string().optional().nullable(),
    aboutTitle: z.string().min(1),
    startDate: z.string().min(1),
    company: z.string().min(1),
    aboutDescription: z.string().optional().nullable(),
    aboutParagraph1: z.string().min(1),
    aboutParagraph2: z.string().min(1),

    servicesParagraph1: z.string().min(1),
    servicesParagraph2: z.string().min(1),

    propertyTypes: z.array(z.string()).default([]),
    clientTypes: z.array(z.string()).default([]),
    areas: z.array(z.string()).default([]),
    serviceList: z.array(z.string()).default([]),

    testimonies: z
      .array(
        z.object({
          name: z.string().min(1),
          text: z.string().min(1),
        })
      )
      .default([]),

    socialMedia: z
      .array(
        z.object({
          platform: SocialPlatformSchema,
          label: z.string().min(1),
          value: z.string().min(1),
          href: z.string().min(1),
        })
      )
      .default([]),

    featuredPropertyIds: z.array(z.string()).max(3).default([]),
  }),
});
