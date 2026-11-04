import type { ArticleDefinition } from "@/lib/content/articles/types";
import { foreignInvestorArticle } from "@/lib/content/articles/invertir-siendo-extranjero";
import { uenoBankArticle } from "@/lib/content/articles/caso-ueno-bank";

// Artículos fijos traducidos a todos los idiomas. Para sumar uno nuevo:
// crear su archivo de contenido, agregarlo acá y crear su page.tsx con
// StaticArticlePage. El índice del blog y el sitemap lo toman solos.
export const TRANSLATED_ARTICLES: ArticleDefinition[] = [
  uenoBankArticle,
  foreignInvestorArticle,
];

export function getTranslatedArticle(slug: string) {
  const article = TRANSLATED_ARTICLES.find((item) => item.slug === slug);
  if (!article) throw new Error(`Artículo desconocido: ${slug}`);
  return article;
}

export { foreignInvestorArticle, uenoBankArticle };
export type { ArticleDefinition } from "@/lib/content/articles/types";
