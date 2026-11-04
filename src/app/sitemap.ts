import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { listPublicBlogPosts } from "@/lib/virtualoffice/blog";
import { SEO_LOCALES, SITE_URL } from "@/lib/seo";
import { DEFAULT_LOCALE } from "@/lib/i18n";
import { HIDDEN_PUBLIC_STATUSES } from "@/lib/properties/public";
import {
  ARTICLE_SLUG as FOREIGN_ARTICLE_SLUG,
  ARTICLE_UPDATED as FOREIGN_ARTICLE_UPDATED,
} from "@/lib/content/articles/invertir-siendo-extranjero";

type SitemapEntry = MetadataRoute.Sitemap[number];

const STATIC_PAGES = [
  {
    path: "",
    changeFrequency: "daily",
    priority: 1,
  },
  // Landings por zona (src/lib/content/zones.ts).
  {
    path: "/invertir-en/asuncion",
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    path: "/invertir-en/mariano-roque-alonso",
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    path: "/invertir-en/luque",
    changeFrequency: "weekly",
    priority: 0.8,
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
    languages: {
      ...Object.fromEntries(
        SEO_LOCALES.map((locale) => [locale, absoluteUrl(locale, path)]),
      ),
      "x-default": absoluteUrl(DEFAULT_LOCALE, path),
    },
  };
}

// Contenido escrito solo en español (artículos del blog): una sola URL, sin
// alternativas de idioma, para no declarar traducciones que no existen.
function spanishOnlyEntry({
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
  return [
    {
      url: absoluteUrl(DEFAULT_LOCALE, path),
      lastModified,
      changeFrequency,
      priority,
    },
  ];
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
    where: {
      deletedAt: null,
      status: { notIn: [...HIDDEN_PUBLIC_STATUSES] },
    },
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
    spanishOnlyEntry({
      path: `/blog/${post.slug}`,
      lastModified: post.updatedAt ?? now,
      changeFrequency: "monthly",
      priority: 0.7,
    }),
  );

  const staticBlogEntries = STATIC_BLOG_ARTICLES.flatMap((post) =>
    spanishOnlyEntry({
      path: `/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "monthly",
      priority: 0.7,
    }),
  );

  // Artículo traducido a todos los idiomas: una URL por idioma con hreflang.
  const translatedArticleEntries = localizedEntries({
    path: `/blog/${FOREIGN_ARTICLE_SLUG}`,
    lastModified: new Date(FOREIGN_ARTICLE_UPDATED),
    changeFrequency: "monthly",
    priority: 0.8,
  });

  return uniqueByUrl([
    ...staticEntries,
    ...translatedArticleEntries,
    ...propertyEntries,
    ...dynamicBlogEntries,
    ...staticBlogEntries,
  ]);
}
