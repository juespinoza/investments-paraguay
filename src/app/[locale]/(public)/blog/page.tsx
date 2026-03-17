import Link from "next/link";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SectionTitle } from "@/components/landing/SectionTitle";
import { buildMetadata } from "@/lib/seo";
import { listPublicBlogPosts } from "@/lib/virtualoffice/blog";

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

export const revalidate = 60;

function buildAuthor(post: Awaited<ReturnType<typeof listPublicBlogPosts>>[number]) {
  return post.advisor?.fullName ?? post.inmobiliaria?.name ?? post.authorRole;
}

export default async function BlogPage() {
  const t = await getTranslations();
  const posts = await listPublicBlogPosts();
  const featured = posts[0] ?? null;
  const rest = posts.slice(1, 5);

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

        {featured ? (
          <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
            <article className="surface-card rounded-[2rem] p-6 md:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-accent1">
                {t("blog.featuredLabel")}
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-primary md:text-5xl">
                {featured.title}
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-secondary md:text-lg">
                {featured.excerpt}
              </p>
              <div className="mt-8 flex flex-wrap gap-3 text-sm text-secondary">
                <span className="rounded-full border border-soft bg-white/70 px-4 py-2">
                  {new Date(featured.updatedAt).toLocaleDateString()}
                </span>
                <span className="rounded-full border border-soft bg-white/70 px-4 py-2">
                  {buildAuthor(featured)}
                </span>
              </div>
              <div className="mt-8">
                <Link
                  href={`/blog/${featured.slug}`}
                  className="btn-primary"
                  data-analytics-event="blog_post_click"
                  data-analytics-category="blog"
                  data-analytics-label={featured.slug}
                  data-analytics-location="featured"
                >
                  {t("blog.readArticle")}
                </Link>
              </div>
            </article>

            <aside className="surface-card rounded-[2rem] p-6 md:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-accent1">
                Últimos artículos
              </p>
              <ul className="mt-5 space-y-4">
                {rest.length > 0 ? (
                  rest.map((post) => (
                    <li
                      key={post.id}
                      className="rounded-[1.25rem] border border-soft bg-white/65 px-4 py-4"
                    >
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-sm font-medium leading-7 text-primary hover:underline"
                        data-analytics-event="blog_post_click"
                        data-analytics-category="blog"
                        data-analytics-label={post.slug}
                        data-analytics-location="sidebar"
                      >
                        {post.title}
                      </Link>
                      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent1">
                        {buildAuthor(post)}
                      </p>
                    </li>
                  ))
                ) : (
                  <li className="rounded-[1.25rem] border border-soft bg-white/65 px-4 py-4 text-sm text-secondary">
                    No hay más artículos publicados.
                  </li>
                )}
              </ul>
            </aside>
          </section>
        ) : (
          <section className="surface-card mt-8 rounded-[2rem] p-6 md:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-primary">
              No hay artículos publicados todavía.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-secondary">
              Cuando el equipo publique contenido desde la oficina virtual, los
              artículos aparecerán aquí automáticamente.
            </p>
          </section>
        )}

        {posts.length > 0 ? (
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
                  key={post.id}
                  className="surface-card rounded-[1.75rem] p-5 md:p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent1">
                        {buildAuthor(post)}
                      </p>
                      <h3 className="mt-3 text-xl font-semibold text-primary">
                        {post.title}
                      </h3>
                    </div>
                    <span className="rounded-full border border-soft bg-white/70 px-3 py-1 text-xs font-medium text-secondary">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-7 text-secondary">
                    {post.excerpt}
                  </p>

                  <div className="mt-6">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="btn-secondary"
                      data-analytics-event="blog_post_click"
                      data-analytics-category="blog"
                      data-analytics-label={post.slug}
                      data-analytics-location="list"
                    >
                      {t("blog.readMore")}
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </div>
  );
}
