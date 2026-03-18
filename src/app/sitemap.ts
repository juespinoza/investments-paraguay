import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SUPPORTED_LOCALES } from "@/lib/i18n";

const baseUrl = "https://www.investmentsparaguay.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const localizedPaths = [
    { path: "", changeFrequency: "weekly" as const, priority: 1 },
    { path: "/bienes-raices", changeFrequency: "weekly" as const, priority: 0.9 },
    { path: "/blog", changeFrequency: "weekly" as const, priority: 0.8 },
    { path: "/legales", changeFrequency: "yearly" as const, priority: 0.4 },
    { path: "/nosotros", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/cookies", changeFrequency: "yearly" as const, priority: 0.3 },
    { path: "/contacto", changeFrequency: "monthly" as const, priority: 0.6 },
  ];

  const staticPages: MetadataRoute.Sitemap = SUPPORTED_LOCALES.flatMap((locale) =>
    localizedPaths.map((item) => ({
      url: `${baseUrl}/${locale}${item.path}`,
      lastModified: now,
      changeFrequency: item.changeFrequency,
      priority: item.priority,
    })),
  );

  const staticArticle: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/es/blog/paraguay-polo-inversion-inmobiliaria-sudamerica`,
      lastModified: new Date("2026-01-27"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const [properties, advisors, inmobiliarias, blogPosts] = await Promise.all([
    prisma.property.findMany({
      where: { deletedAt: null },
      select: { slug: true, updatedAt: true },
    }),
    prisma.advisor.findMany({
      where: { deletedAt: null },
      select: { slug: true, updatedAt: true },
    }),
    prisma.inmobiliaria.findMany({
      where: { deletedAt: null },
      select: { slug: true, updatedAt: true },
    }),
    prisma.blogPost.findMany({
      where: { deletedAt: null },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const propertyEntries: MetadataRoute.Sitemap = SUPPORTED_LOCALES.flatMap((locale) =>
    properties.map((property) => ({
      url: `${baseUrl}/${locale}/bienes-raices/propiedades/${property.slug}`,
      lastModified: property.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  );

  const advisorEntries: MetadataRoute.Sitemap = SUPPORTED_LOCALES.flatMap((locale) =>
    advisors.map((advisor) => ({
      url: `${baseUrl}/${locale}/bienes-raices/asesores/${advisor.slug}`,
      lastModified: advisor.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  );

  const inmobiliariaEntries: MetadataRoute.Sitemap = SUPPORTED_LOCALES.flatMap((locale) =>
    inmobiliarias.map((item) => ({
      url: `${baseUrl}/${locale}/bienes-raices/inmobiliarias/${item.slug}`,
      lastModified: item.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  );

  const blogEntries: MetadataRoute.Sitemap = SUPPORTED_LOCALES.flatMap((locale) =>
    blogPosts.map((post) => ({
      url: `${baseUrl}/${locale}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  );

  return [
    ...staticPages,
    ...staticArticle,
    ...propertyEntries,
    ...advisorEntries,
    ...inmobiliariaEntries,
    ...blogEntries,
  ];
}
