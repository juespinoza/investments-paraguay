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
    "paraguayPolo",
    "departamentosPozo",
    "airbnbParaguay",
    "terrenosVsDepartamento",
    "guiaInversores",
  ] as const;

  return (
    <div className="px-4 py-10">
      <div className="container-page">
        <div className="eyebrow">{t("blog.eyebrow")}</div>
        <div className="mt-5">
          <SectionTitle
            title={t("blog.title")}
            subtitle={t("blog.subtitle")}
            align="left"
          />
        </div>
        <ul className="mt-8 grid gap-4 text-secondary">
          {posts.map((post, index) => (
            <li key={post} className="surface-card rounded-[1.5rem] p-5 text-base">
              {index === 0 ? (
                <Link href="/blog/paraguay-polo-inversion-inmobiliaria-sudamerica">
                  {t(`blog.posts.${post}`)}
                </Link>
              ) : (
                t(`blog.posts.${post}`)
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
