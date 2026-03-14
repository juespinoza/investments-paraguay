import { SectionTitle } from "@/components/landing/SectionTitle";
import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { useTranslations } from "next-intl";

export const metadata: Metadata = buildMetadata({
  title: "Investment Blog Paraguay | Real Estate, Business and Market Insights",
  description:
    "Read articles about investing in Paraguay, the local real estate market, business opportunities and guidance for foreign investors.",
  pathname: "/blog",
  locale: "en",
  keywords: [
    "Paraguay investment blog",
    "Paraguay real estate blog",
    "Paraguay market insights",
    "invest in Paraguay blog",
  ],
});

export default function BlogPage() {
  const t = useTranslations();
  const posts = [
    {
      key: "paraguayPolo",
      href: "/blog/paraguay-polo-inversion-inmobiliaria-sudamerica",
      published: true,
    },
    { key: "departamentosPozo", published: false },
    { key: "airbnbParaguay", published: false },
    { key: "terrenosVsDepartamento", published: false },
    { key: "guiaInversores", published: false },
  ] as const;
  const featured = posts[0];
  const pipeline = posts.slice(1);

  return (
    <div className="px-4 py-10">
      <div className="container-page">
        <section className="section-shell bg-[linear-gradient(135deg,#0f1726_0%,#18253d_52%,#243653_100%)] px-6 py-10 text-white shadow-[0_24px_80px_rgba(15,23,38,0.18)] md:px-10 md:py-14">
          <div className="eyebrow border-white/16 text-white">
            {t("blog.eyebrow")}
          </div>
          <div className="mt-5 max-w-4xl">
            <SectionTitle
              title={t("blog.title")}
              subtitle={t("blog.subtitle")}
              align="left"
            />
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {(["market", "strategy", "guides"] as const).map((item) => (
              <div
                key={item}
                className="rounded-[1.5rem] border border-white/10 bg-white/8 px-5 py-5 backdrop-blur-sm"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--ip-accent1)]">
                  {t(`blog.highlights.${item}.label`)}
                </p>
                <p className="mt-3 text-base leading-7 text-white/78">
                  {t(`blog.highlights.${item}.value`)}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <article className="surface-card rounded-[2rem] p-6 md:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-accent1">
              {t("blog.featuredLabel")}
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-primary md:text-5xl">
              {t(`blog.posts.${featured.key}`)}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-secondary md:text-lg">
              {t("blog.featuredExcerpt")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-secondary">
              <span className="rounded-full border border-soft bg-white/70 px-4 py-2">
                {t("blog.meta.updated")}
              </span>
              <span className="rounded-full border border-soft bg-white/70 px-4 py-2">
                {t("blog.meta.author")}
              </span>
            </div>
            <div className="mt-8">
              <Link href={featured.href} className="btn-primary">
                {t("blog.readArticle")}
              </Link>
            </div>
          </article>

          <aside className="surface-card rounded-[2rem] p-6 md:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-accent1">
              {t("blog.sidebarLabel")}
            </p>
            <ul className="mt-5 space-y-4">
              {pipeline.map((post) => (
                <li
                  key={post.key}
                  className="rounded-[1.25rem] border border-soft bg-white/65 px-4 py-4"
                >
                  <p className="text-sm font-medium leading-7 text-primary">
                    {t(`blog.posts.${post.key}`)}
                  </p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent1">
                    {t("blog.comingSoon")}
                  </p>
                </li>
              ))}
            </ul>
          </aside>
        </section>

        <section className="mt-8">
          <div className="mb-6">
            <div className="eyebrow">{t("blog.listLabel")}</div>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-primary md:text-5xl">
              {t("blog.listTitle")}
            </h2>
          </div>

          <ul className="grid gap-4 text-secondary md:grid-cols-2">
            {posts.map((post, index) => (
              <li
                key={post.key}
                className="surface-card rounded-[1.75rem] p-5 md:p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent1">
                      {post.published
                        ? t("blog.statusPublished")
                        : t("blog.statusPipeline")}
                    </p>
                    <h3 className="mt-3 text-xl font-semibold text-primary">
                      {t(`blog.posts.${post.key}`)}
                    </h3>
                  </div>
                  <span className="rounded-full border border-soft bg-white/70 px-3 py-1 text-xs font-medium text-secondary">
                    0{index + 1}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-7 text-secondary">
                  {t(`blog.excerpts.${post.key}`)}
                </p>

                <div className="mt-6">
                  {post.published ? (
                    <Link href={post.href} className="btn-secondary">
                      {t("blog.readMore")}
                    </Link>
                  ) : (
                    <span className="inline-flex rounded-full border border-soft bg-white/70 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
                      {t("blog.comingSoon")}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
