import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getPublicBlogPostBySlug } from "@/lib/virtualoffice/blog";
import { resolveLocale } from "@/lib/content/public-pages";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPublicBlogPostBySlug(slug);
  const resolvedLocale = resolveLocale(locale);

  if (!post) {
    return buildMetadata({
      title: "Blog | Investments Paraguay",
      description: "Artículo no encontrado.",
      pathname: `/blog/${slug}`,
      locale: resolvedLocale,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: `${post.title} | Investments Paraguay`,
    description: post.content.replace(/\s+/g, " ").trim().slice(0, 160),
    pathname: `/blog/${slug}`,
    locale: resolvedLocale,
    image: post.coverImageUrl ?? "/images/logo.png",
  });
}

function buildAuthor(post: NonNullable<Awaited<ReturnType<typeof getPublicBlogPostBySlug>>>) {
  return post.advisor?.fullName ?? post.inmobiliaria?.name ?? post.authorRole;
}

export default async function PublicBlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPublicBlogPostBySlug(slug);

  if (!post) {
    return notFound();
  }

  const paragraphs = post.content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <div className="px-4 py-10">
      <div className="container-page">
        <article className="mx-auto max-w-4xl">
          <div className="section-shell bg-[linear-gradient(135deg,var(--carbon)_0%,var(--onyx)_100%)] px-6 py-10 text-[var(--ivory)] shadow-[0_24px_80px_rgba(10,10,10,0.18)] md:px-10 md:py-14">
            <div className="eyebrow border-[rgba(191,168,130,0.35)] bg-[rgba(250,250,248,0.08)] text-[var(--ivory)]">
              Artículo
            </div>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-6xl">
              {post.title}
            </h1>
            <div className="mt-8 flex flex-col gap-3 text-sm text-[rgba(250,250,248,0.72)] sm:flex-row sm:gap-4">
              <span className="rounded-full border border-[rgba(191,168,130,0.22)] bg-[rgba(250,250,248,0.08)] px-4 py-2">
                Actualizado: {new Date(post.updatedAt).toLocaleDateString()}
              </span>
              <span className="rounded-full border border-[rgba(191,168,130,0.22)] bg-[rgba(250,250,248,0.08)] px-4 py-2">
                Autor: {buildAuthor(post)}
              </span>
            </div>
          </div>

          <div className="surface-card mt-8 rounded-[2rem] px-6 py-8 md:px-10 md:py-10">
            {paragraphs.map((paragraph, index) => (
              <p
                key={`${post.id}-${index}`}
                className="mb-6 text-justify text-base leading-8 text-secondary"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}
