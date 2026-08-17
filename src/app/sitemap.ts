import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { listPublicBlogPosts } from "@/lib/virtualoffice/blog";
import { SEO_LOCALES, SITE_URL } from "@/lib/seo";

type SitemapEntry = MetadataRoute.Sitemap[number];

const STATIC_PAGES = [
  {
    path: "",
    changeFrequency: "daily",
    priority: 1,
  },
  {
    path: "/bienes-raices",
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    path: "/blog",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    path: "/nosotros",
    changeFrequency: "monthly",
    priority: 0.5,
  },
  {
    path: "/contacto",
    changeFrequency: "monthly",
    priority: 0.5,
  },
  {
    path: "/legales",
    changeFrequency: "yearly",
    priority: 0.3,
  },
] as const satisfies Array<{
  path: string;
  changeFrequency: SitemapEntry["changeFrequency"];
  priority: number;
}>;

const STATIC_BLOG_ARTICLES = [
  {
    slug: "paraguay-polo-inversion-inmobiliaria-sudamerica",
    updatedAt: new Date("2026-01-27"),
  },
] as const;

function absoluteUrl(locale: (typeof SEO_LOCALES)[number], path: string) {
  return `${SITE_URL}/${locale}${path}`;
}

function localizedAlternates(path: string) {
  return {
    languages: Object.fromEntries(
      SEO_LOCALES.map((locale) => [locale, absoluteUrl(locale, path)]),
    ),
  };
}

function localizedEntries({
  path,
  lastModified,
  changeFrequency,
  priority,
}: {
  path: string;
  lastModified: Date;
  changeFrequency: SitemapEntry["changeFrequency"];
  priority: number;
}): MetadataRoute.Sitemap {
  return SEO_LOCALES.map((locale) => ({
    url: absoluteUrl(locale, path),
    lastModified,
    changeFrequency,
    priority,
    alternates: localizedAlternates(path),
  }));
}

function uniqueByUrl(entries: MetadataRoute.Sitemap): MetadataRoute.Sitemap {
  return Array.from(
    new Map(entries.map((entry) => [entry.url, entry])).values(),
  );
}

async function listPropertySitemapItems() {
  return prisma.property.findMany({
    where: { deletedAt: null },
    orderBy: [
      { isFeatured: "desc" },
      { featuredOrder: "asc" },
      { updatedAt: "desc" },
    ],
    select: {
      slug: true,
      updatedAt: true,
    },
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [properties, blogPosts] = await Promise.all([
    listPropertySitemapItems(),
    listPublicBlogPosts(),
  ]);

  const staticEntries = STATIC_PAGES.flatMap((page) =>
    localizedEntries({
      path: page.path,
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    }),
  );

  const propertyEntries = properties.flatMap((property) =>
    localizedEntries({
      path: `/bienes-raices/propiedades/${property.slug}`,
      lastModified: property.updatedAt ?? now,
      changeFrequency: "weekly",
      priority: 0.8,
    }),
  );

  const dynamicBlogEntries = blogPosts.flatMap((post) =>
    localizedEntries({
      path: `/blog/${post.slug}`,
      lastModified: post.updatedAt ?? now,
      changeFrequency: "monthly",
      priority: 0.7,
    }),
  );

  const staticBlogEntries = STATIC_BLOG_ARTICLES.flatMap((post) =>
    localizedEntries({
      path: `/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "monthly",
      priority: 0.7,
    }),
  );

  return uniqueByUrl([
    ...staticEntries,
    ...propertyEntries,
    ...dynamicBlogEntries,
    ...staticBlogEntries,
  ]);
}
