import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  BlogIndexClient,
  type BlogCategory,
  type BlogIndexPost,
} from "@/components/landing/BlogIndexClient";
import { buildMetadata } from "@/lib/seo";
import { GuideLeadMagnet } from "@/components/leads/GuideLeadMagnet";
import { toSupportedLocale } from "@/lib/i18n";
import { TRANSLATED_ARTICLES } from "@/lib/content/articles";
import { listPublicBlogPosts } from "@/lib/virtualoffice/blog";
import { resolveLocale } from "@/lib/content/public-pages";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale: routeLocale } = await params;
  const locale = resolveLocale(routeLocale);

  const seoByLocale = {
    en: {
      title:
        "Real Estate, Business and Market Insights | Paraguay Investment Blog",
      description:
        "Read articles about investing in Paraguay, the local real estate market, business opportunities and guidance for foreign investors.",
      keywords: [
        "Paraguay investment blog",
        "Paraguay real estate blog",
        "Paraguay market insights",
        "invest in Paraguay blog",
      ],
    },
    es: {
      title: "Real Estate, negocios y mercado | Blog de Inversión en Paraguay",
      description:
        "Lea artículos sobre inversión en Paraguay, mercado inmobiliario local, negocios y oportunidades para inversores.",
      keywords: [
        "blog inversion paraguay",
        "blog bienes raices paraguay",
        "mercado inmobiliario paraguay",
        "invertir en paraguay",
      ],
    },
    pt: {
      title: "Imóveis, negócios e mercado | Blog de Investimento no Paraguai",
      description:
        "Leia artigos sobre investimento no Paraguai, mercado imobiliário local, negócios e oportunidades para investidores.",
      keywords: [
        "blog investimento paraguai",
        "blog imoveis paraguai",
        "mercado imobiliario paraguai",
        "investir no paraguai",
      ],
    },
    de: {
      title:
        "Immobilien, Wirtschaft und Marktanalysen | Paraguay Investment Blog",
      description:
        "Lesen Sie Beiträge über Investitionen in Paraguay, den lokalen Immobilienmarkt, Geschäftschancen und Marktanalysen.",
      keywords: [
        "paraguay investment blog",
        "paraguay immobilien blog",
        "paraguay marktanalyse",
        "in paraguay investieren",
      ],
    },
  } as const;

  const seo = seoByLocale[locale];

  return buildMetadata({
    title: seo.title,
    description: seo.description,
    pathname: "/blog",
    locale,
    image: "/images/og-home.jpg",
    keywords: [...seo.keywords],
  });
}

export const revalidate = 60;

type PublicBlogPost = Awaited<ReturnType<typeof listPublicBlogPosts>>[number];

function buildAuthor(post: PublicBlogPost) {
  return post.advisor?.fullName ?? post.inmobiliaria?.name ?? post.authorRole;
}

function inferCategory(post: PublicBlogPost): Exclude<BlogCategory, "all"> {
  const source = `${post.title} ${post.excerpt}`.toLowerCase();

  if (
    /\b(gu[ií]a|legal|paso|extranjero|operativ|documentaci[oó]n)\b/.test(
      source,
    )
  ) {
    return "guides";
  }

  if (
    /\b(estrateg|renta|roi|airbnb|pozo|terreno|departamento|plusval[ií]a)\b/.test(
      source,
    )
  ) {
    return "strategy";
  }

  return "market";
}

function toBlogIndexPost(post: PublicBlogPost): BlogIndexPost {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    coverImageUrl: post.coverImageUrl,
    updatedAt: post.updatedAt.toISOString(),
    author: buildAuthor(post),
    category: inferCategory(post),
  };
}

// Artículos escritos como páginas estáticas en el código (no en la base).
// Se suman al índice para que el blog no aparezca vacío.
function getStaticPosts(locale: string): BlogIndexPost[] {
  const supportedLocale = toSupportedLocale(locale);

  return [
    ...TRANSLATED_ARTICLES.map((definition) => {
      const article = definition.content[supportedLocale];
      return {
        id: `static-${definition.slug}`,
        title: article.title,
        slug: definition.slug,
        excerpt: article.excerpt,
        coverImageUrl: definition.cover?.src ?? null,
        // Mediodía UTC: "2026-11-05" a medianoche UTC sería el día 4 en Paraguay.
        updatedAt: new Date(`${definition.updated}T12:00:00Z`).toISOString(),
        author: "Julia Espinoza",
        category: definition.category,
        contentLocale: supportedLocale,
      } satisfies BlogIndexPost;
    }),
    ...STATIC_SPANISH_POSTS,
  ];
}

const STATIC_SPANISH_POSTS: BlogIndexPost[] = [
  {
    id: "static-paraguay-polo",
    title:
      "Por qué Paraguay se está consolidando como un nuevo polo de inversión inmobiliaria en Sudamérica",
    slug: "paraguay-polo-inversion-inmobiliaria-sudamerica",
    excerpt:
      "Qué está impulsando la percepción de Paraguay como destino inmobiliario y cómo interpretar esas señales con criterio.",
    coverImageUrl: null,
    updatedAt: new Date("2026-01-27T12:00:00Z").toISOString(),
    author: "Investments Paraguay",
    category: "market",
  },
];

export default async function BlogPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const dbPosts = (await listPublicBlogPosts()).map(toBlogIndexPost);
  const dbSlugs = new Set(dbPosts.map((post) => post.slug));
  const posts = [
    ...dbPosts,
    ...getStaticPosts(locale).filter((post) => !dbSlugs.has(post.slug)),
  ].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
  const topics = (["market", "strategy", "guides"] as const).map(
    (category) => ({
      category,
      title: t(`blog.highlights.${category}.label`),
      description: t(`blog.highlights.${category}.value`),
    }),
  );

  return (
    <>
      <BlogIndexClient
        posts={posts}
        topics={topics}
        dictionary={{
          eyebrow: t("blog.eyebrow"),
          title: t("blog.title"),
          subtitle: t("blog.subtitle"),
          all: t("site.blog.all"),
          readMore: t("blog.readMore"),
          featuredLabel: t("blog.featuredLabel"),
          emptyTitle: t("site.blog.emptyTitle"),
          emptySubtitle: t("site.blog.emptySubtitle"),
          emptyCta: t("site.blog.emptyCta"),
        }}
      />
      <div className="mt-12">
        <GuideLeadMagnet location="blog" />
      </div>
    </>
  );
}
