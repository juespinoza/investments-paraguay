"use client";

import Image, { type ImageLoaderProps } from "next/image";
import { ArrowRight, BarChart3, BookOpen, Compass } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "din9bhvas";
const FALLBACK_BLOG_IMAGE = "/backgrounds/asuncion-hero-768.webp";

export type BlogCategory = "all" | "market" | "strategy" | "guides";

export type BlogIndexPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl: string | null;
  updatedAt: string;
  author: string;
  category: Exclude<BlogCategory, "all">;
};

type TopicCard = {
  category: Exclude<BlogCategory, "all">;
  title: string;
  description: string;
};

type BlogIndexClientProps = {
  posts: BlogIndexPost[];
  topics: TopicCard[];
  dictionary: {
    eyebrow: string;
    title: string;
    subtitle: string;
    all: string;
    readMore: string;
    featuredLabel: string;
    emptyTitle: string;
    emptySubtitle: string;
    emptyCta: string;
  };
};

const CATEGORY_LABELS: Record<BlogCategory, string> = {
  all: "Todos",
  market: "Mercado",
  strategy: "Estrategia",
  guides: "Guías",
};

const TOPIC_ICONS = {
  market: BarChart3,
  strategy: Compass,
  guides: BookOpen,
} as const;

function isRemoteUrl(src: string) {
  return src.startsWith("http://") || src.startsWith("https://");
}

function isCloudinaryUrl(src: string) {
  return src.includes("res.cloudinary.com") && src.includes("/upload/");
}

function cloudinaryLoader({ src, width, quality }: ImageLoaderProps) {
  const transformation = `c_fill,w_${width},g_center/f_auto/q_${quality ?? "auto"}`;

  if (isCloudinaryUrl(src)) {
    return src.replace("/upload/", `/upload/${transformation}/`);
  }

  if (!isRemoteUrl(src) && !src.startsWith("/")) {
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformation}/v1/${src}`;
  }

  return src;
}

function BlogImage({
  src,
  alt,
  priority = false,
  sizes,
}: {
  src: string | null;
  alt: string;
  priority?: boolean;
  sizes: string;
}) {
  const imageUrl = src?.trim() || FALLBACK_BLOG_IMAGE;
  const imageProps = imageUrl.startsWith("/")
    ? { src: imageUrl }
    : { src: imageUrl, loader: cloudinaryLoader };

  return (
    <Image
      {...imageProps}
      alt={alt}
      fill
      priority={priority}
      loading={priority ? undefined : "lazy"}
      sizes={sizes}
      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
    />
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-PY", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function ArticleCard({
  post,
  readMoreLabel,
  featuredLabel,
  featured = false,
}: {
  post: BlogIndexPost;
  readMoreLabel: string;
  featuredLabel: string;
  featured?: boolean;
}) {
  const categoryLabel = CATEGORY_LABELS[post.category];

  return (
    <article
      className={cn(
        "group overflow-hidden rounded-lg border border-soft bg-(--ivory)",
        featured && "lg:grid lg:grid-cols-[45fr_55fr]",
      )}
    >
      <Link
        href={`/blog/${post.slug}`}
        aria-label={`Leer ${post.title}`}
        className={cn(
          "relative block aspect-video overflow-hidden bg-(--stone)",
          featured
            ? "rounded-t-lg lg:h-full lg:min-h-90 lg:rounded-l-lg lg:rounded-tr-none"
            : "rounded-t-lg",
        )}
      >
        <BlogImage
          src={post.coverImageUrl}
          alt={post.title}
          priority={featured}
          sizes={
            featured
              ? "(min-width: 1024px) 576px, 100vw"
              : "(min-width: 1024px) 33vw, 100vw"
          }
        />
      </Link>

      <div className={cn("p-5", featured && "lg:p-8")}>
        {featured ? (
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-(--gold)">
            {featuredLabel}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-(--gold)">
            {categoryLabel}
          </span>
          <time className="text-[12px] text-muted" dateTime={post.updatedAt}>
            {formatDate(post.updatedAt)}
          </time>
        </div>

        <h3
          className={cn(
            "mt-4 font-cormorant font-normal leading-tight text-primary",
            featured ? "text-[28px] md:text-[34px]" : "text-[20px]",
          )}
        >
          <Link
            href={`/blog/${post.slug}`}
            className="decoration-(--gold) decoration-1 underline-offset-4 hover:underline"
          >
            {post.title}
          </Link>
        </h3>

        <p
          className={cn(
            "mt-4 overflow-hidden text-muted",
            featured
              ? "text-[15px] leading-7 md:text-base"
              : "text-[14px] leading-6",
          )}
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
          }}
        >
          {post.excerpt}
        </p>

        <div className="mt-6 flex items-center justify-between gap-4">
          <p className="text-[12px] text-muted">{post.author}</p>
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-2 text-[13px] font-medium text-primary transition-colors duration-150 hover:text-(--gold)"
          >
            {readMoreLabel}
            <ArrowRight size={15} strokeWidth={1.8} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function CategoryFilters({
  activeCategory,
  onChange,
  allLabel,
}: {
  activeCategory: BlogCategory;
  onChange: (category: BlogCategory) => void;
  allLabel: string;
}) {
  const categories: BlogCategory[] = ["all", "market", "strategy", "guides"];

  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
      {categories.map((category) => {
        const isActive = activeCategory === category;
        const label = category === "all" ? allLabel : CATEGORY_LABELS[category];

        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            className={cn(
              "shrink-0 rounded-xs border px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.06em] transition-colors duration-150",
              isActive
                ? "border-(--carbon) bg-(--carbon) text-(--ivory)"
                : "border-soft bg-transparent text-muted hover:border-(--gold) hover:text-primary",
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

function EmptyBlogState({
  topics,
  dictionary,
}: {
  topics: TopicCard[];
  dictionary: BlogIndexClientProps["dictionary"];
}) {
  return (
    <>
      <section className="mx-auto mt-14 max-w-120 text-center md:mt-20">
        <BookOpen
          size={48}
          strokeWidth={1.4}
          className="mx-auto text-muted"
          aria-hidden="true"
        />
        <h2 className="mt-6 font-cormorant text-[24px] font-normal leading-tight text-primary">
          {dictionary.emptyTitle}
        </h2>
        <p className="mt-4 text-[15px] leading-[1.7] text-muted">
          {dictionary.emptySubtitle}
        </p>
        <div className="mt-8">
          <Link
            href="/bienes-raices"
            className="inline-flex rounded-xs border border-current px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.06em] text-primary transition-colors duration-150 hover:bg-(--carbon) hover:text-(--ivory)"
          >
            {dictionary.emptyCta}
          </Link>
        </div>
      </section>

      <section className="mt-14 grid gap-3 md:mt-18 md:grid-cols-3">
        {topics.map((topic) => {
          const Icon = TOPIC_ICONS[topic.category];

          return (
            <article
              key={topic.category}
              className="flex gap-4 rounded-lg border border-soft bg-(--ivory) p-5"
            >
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-[rgba(191,168,130,0.16)] text-(--gold)">
                <Icon size={20} strokeWidth={1.7} aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-[15px] font-medium text-primary">
                  {topic.title}
                </h3>
                <p className="mt-2 text-[13px] leading-6 text-muted">
                  {topic.description}
                </p>
              </div>
            </article>
          );
        })}
      </section>
    </>
  );
}

export function BlogIndexClient({
  posts,
  topics,
  dictionary,
}: BlogIndexClientProps) {
  const [activeCategory, setActiveCategory] = useState<BlogCategory>("all");
  const filteredPosts = useMemo(() => {
    if (activeCategory === "all") return posts;
    return posts.filter((post) => post.category === activeCategory);
  }, [activeCategory, posts]);
  const featuredPost = filteredPosts[0] ?? null;
  const remainingPosts = filteredPosts.slice(1);

  return (
    <div className="px-4 py-10 md:py-14">
      <div className="container-page">
        <section className="border-b border-(--line) pb-10 md:pb-14">
          <div className="eyebrow">{dictionary.eyebrow}</div>
          <div className="mt-5 max-w-3xl">
            <h1 className="font-cormorant text-[42px] font-normal leading-[1.08] text-primary md:text-[64px]">
              {dictionary.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-secondary md:text-lg">
              {dictionary.subtitle}
            </p>
          </div>
        </section>

        {posts.length > 0 ? (
          <section className="mt-8 md:mt-10">
            <CategoryFilters
              activeCategory={activeCategory}
              onChange={setActiveCategory}
              allLabel={dictionary.all}
            />

            {featuredPost ? (
              <div className="mt-8">
                <ArticleCard
                  post={featuredPost}
                  readMoreLabel={dictionary.readMore}
                  featuredLabel={dictionary.featuredLabel}
                  featured
                />
              </div>
            ) : null}

            {remainingPosts.length > 0 ? (
              <div className="mt-6 grid gap-6 lg:grid-cols-3">
                {remainingPosts.map((post) => (
                  <ArticleCard
                    key={post.id}
                    post={post}
                    readMoreLabel={dictionary.readMore}
                    featuredLabel={dictionary.featuredLabel}
                  />
                ))}
              </div>
            ) : null}

            {!featuredPost ? (
              <div className="mt-10 rounded-lg border border-soft bg-(--ivory) px-5 py-8 text-center text-[14px] text-muted">
                No hay artículos publicados en esta categoría todavía.
              </div>
            ) : null}
          </section>
        ) : (
          <EmptyBlogState topics={topics} dictionary={dictionary} />
        )}
      </div>
    </div>
  );
}
