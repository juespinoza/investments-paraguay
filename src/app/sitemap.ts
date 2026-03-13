import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const baseUrl = "https://www.investmentsparaguay.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/bienes-raices`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/paraguay-polo-inversion-inmobiliaria-sudamerica`,
      lastModified: new Date("2026-01-27"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/legales`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/nosotros`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const [properties, advisors] = await Promise.all([
    prisma.property.findMany({
      where: { deletedAt: null },
      select: { slug: true, updatedAt: true },
    }),
    prisma.advisor.findMany({
      where: { deletedAt: null },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const propertyEntries: MetadataRoute.Sitemap = properties.map((property) => ({
    url: `${baseUrl}/bienes-raices/propiedades/${property.slug}`,
    lastModified: property.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const advisorEntries: MetadataRoute.Sitemap = advisors.map((advisor) => ({
    url: `${baseUrl}/bienes-raices/asesores/${advisor.slug}`,
    lastModified: advisor.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticPages, ...propertyEntries, ...advisorEntries];
}
