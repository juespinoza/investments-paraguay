import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  BlogIndexClient,
  type BlogCategory,
  type BlogIndexPost,
} from "@/components/landing/BlogIndexClient";
import { buildMetadata } from "@/lib/seo";
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

export default async function BlogPage() {
  const t = await getTranslations();
  const posts = (await listPublicBlogPosts()).map(toBlogIndexPost);
  const topics = (["market", "strategy", "guides"] as const).map(
    (category) => ({
      category,
      title: t(`blog.highlights.${category}.label`),
      description: t(`blog.highlights.${category}.value`),
    }),
  );

  return (
    <BlogIndexClient
      posts={posts}
      topics={topics}
      dictionary={{
        eyebrow: t("blog.eyebrow"),
        title: t("blog.title"),
        subtitle: t("blog.subtitle"),
        all: "Todos",
        readMore: t("blog.readMore"),
        featuredLabel: t("blog.featuredLabel"),
        emptyTitle: "Análisis en preparación",
        emptySubtitle:
          "Pronto publicaremos guías de mercado, análisis de zonas y estrategias para inversores en Paraguay.",
        emptyCta: "Ver propiedades disponibles",
      }}
    />
  );
}
