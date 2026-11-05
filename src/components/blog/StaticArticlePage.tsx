import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { StructuredData } from "@/components/seo/StructuredData";
import { ArticleBody } from "@/components/blog/ArticleBody";
import { GuideLeadMagnet } from "@/components/leads/GuideLeadMagnet";
import Image from "next/image";
import { ImageCloudinary } from "@/components/ui/ImageCloudinary";
import { Link } from "@/i18n/navigation";
import { buildMetadata, SITE_NAME, SITE_URL } from "@/lib/seo";
import { toSupportedLocale } from "@/lib/i18n";
import type { ArticleDefinition } from "@/lib/content/articles/types";

const AUTHOR_PHOTO_ID = "julia-espinoza_x2f38t";

export async function buildStaticArticleMetadata(
  definition: ArticleDefinition,
  routeLocale: string,
): Promise<Metadata> {
  const locale = toSupportedLocale(routeLocale);
  const article = definition.content[locale];
  const PATHNAME = `/blog/${definition.slug}`;
  const base = buildMetadata({
    title: `${article.metaTitle} | ${SITE_NAME}`,
    description: article.description,
    pathname: PATHNAME,
    locale,
    image: definition.cover?.og ?? "/images/og-home.jpg",
    keywords: [article.metaTitle, "Paraguay", "real estate", "Asunción"],
  });

  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: definition.published,
      modifiedTime: definition.updated,
      authors: ["Julia Espinoza"],
    },
  };
}

export function StaticArticlePage({
  definition,
  routeLocale,
}: {
  definition: ArticleDefinition;
  routeLocale: string;
}) {
  setRequestLocale(routeLocale);
  const locale = toSupportedLocale(routeLocale);
  const article = definition.content[locale];
  const sources = definition.sources;
  const PATHNAME = `/blog/${definition.slug}`;
  const url = `${SITE_URL}/${locale}${PATHNAME}`;
  const toc = article.blocks.filter(
    (block): block is Extract<typeof block, { type: "h2" }> =>
      block.type === "h2",
  );

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.description,
      inLanguage: locale,
      datePublished: definition.published,
      dateModified: definition.updated,
      image: `${SITE_URL}${definition.cover?.og ?? "/images/og-home.jpg"}`,
      author: {
        "@type": "Person",
        name: "Julia Espinoza",
        jobTitle: article.authorRole,
        url: `${SITE_URL}/${locale}/nosotros`,
      },
      publisher: {
        "@type": "Organization",
        name: SITE_NAME,
        logo: { "@type": "ImageObject", url: `${SITE_URL}/images/logo.png` },
      },
      mainEntityOfPage: url,
      citation: sources.map((source) => source.url),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: SITE_NAME, item: `${SITE_URL}/${locale}` },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/${locale}/blog` },
        { "@type": "ListItem", position: 3, name: article.title, item: url },
      ],
    },
  ];

  return (
    <div className="px-4 py-10">
      <StructuredData data={jsonLd} />
      <div className="container-page">
        <article className="mx-auto max-w-3xl">
          <header className="section-shell bg-[linear-gradient(135deg,var(--carbon)_0%,var(--onyx)_100%)] px-6 py-10 text-(--ivory) shadow-[0_24px_80px_rgba(10,10,10,0.18)] md:px-10 md:py-12">
            <nav className="text-[12px] text-[rgba(250,250,248,0.6)]">
              <Link href="/blog" className="hover:text-(--gold)">
                Blog
              </Link>
            </nav>
            <h1 className="mt-5 font-cormorant text-[36px] font-normal leading-[1.1] md:text-[52px]">
              {article.title}
            </h1>
            <p className="mt-5 text-lg leading-8 text-[rgba(250,250,248,0.8)]">
              {article.lead}
            </p>
            <div className="mt-8 flex items-center gap-3">
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-[rgba(191,168,130,0.4)] bg-(--onyx)">
                <ImageCloudinary imageUrl={AUTHOR_PHOTO_ID} alt="Julia Espinoza" />
              </div>
              <div className="text-[13px] leading-5">
                <Link href="/nosotros" className="font-semibold hover:text-(--gold)">
                  Julia Espinoza
                </Link>
                <p className="text-[rgba(250,250,248,0.65)]">
                  {article.authorRole} · {article.updatedLabel} ·{" "}
                  {article.readingTime}
                </p>
              </div>
            </div>
          </header>

          {definition.cover ? (
            <figure className="mt-8 overflow-hidden rounded-4xl border border-soft bg-(--stone)">
              <Image
                src={definition.cover.src}
                alt={definition.cover.alt[locale]}
                width={definition.cover.width}
                height={definition.cover.height}
                sizes="(min-width: 800px) 768px, 100vw"
                priority
                className="h-auto w-full"
              />
            </figure>
          ) : null}

          <div className="surface-card mt-8 rounded-4xl px-6 py-8 md:px-10 md:py-10">
            <nav
              aria-label={article.tocTitle}
              className="mb-8 rounded-lg border border-(--line) p-5"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted">
                {article.tocTitle}
              </p>
              <ol className="mt-3 grid gap-1.5 text-[14px] sm:grid-cols-2">
                {toc.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="text-primary hover:text-(--gold)"
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <ArticleBody article={article} />

            <p className="mt-10 border-t border-(--line) pt-6 text-[13px] italic leading-6 text-muted">
              {article.disclaimer}
            </p>

            <h2 className="mt-8 text-[13px] font-semibold uppercase tracking-[0.1em] text-muted">
              {article.sourcesTitle}
            </h2>
            <ul className="mt-3 space-y-2 text-[14px] leading-6">
              {sources.map((source) => (
                <li key={source.url}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary underline decoration-(--line) underline-offset-4 hover:text-(--gold)"
                  >
                    {source.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </article>

        <div className="mx-auto mt-10 max-w-3xl">
          <GuideLeadMagnet location="blog" variant="card" />
        </div>
      </div>
    </div>
  );
}
