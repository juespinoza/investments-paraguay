import type { Metadata } from "next";
import {
  StaticArticlePage,
  buildStaticArticleMetadata,
} from "@/components/blog/StaticArticlePage";
import { getTranslatedArticle } from "@/lib/content/articles";

const article = getTranslatedArticle("caso-ueno-bank-que-significa-para-invertir");

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  return buildStaticArticleMetadata(article, (await params).locale);
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  return <StaticArticlePage definition={article} routeLocale={locale} />;
}
