import type { ArticleDefinition } from "@/lib/content/articles/types";
import { foreignInvestorArticle } from "@/lib/content/articles/invertir-siendo-extranjero";
import { uenoBankArticle } from "@/lib/content/articles/caso-ueno-bank";
import { impeachmentArticle } from "@/lib/content/articles/juicio-politico-pena";
import { asuncionGuideArticle } from "@/lib/content/articles/guia-asuncion";
import { offPlanArticle } from "@/lib/content/articles/comprar-en-pozo";
import { deedCostArticle } from "@/lib/content/articles/costo-escriturar";
import { investmentGradeArticle } from "@/lib/content/articles/grado-de-inversion";
import { neighborhoodPricesArticle } from "@/lib/content/articles/precios-por-barrio";

// Artículos fijos traducidos a todos los idiomas. Para sumar uno nuevo:
// crear su archivo de contenido, agregarlo acá y crear su page.tsx con
// StaticArticlePage. El índice del blog y el sitemap lo toman solos.
export const TRANSLATED_ARTICLES: ArticleDefinition[] = [
  neighborhoodPricesArticle,
  investmentGradeArticle,
  deedCostArticle,
  offPlanArticle,
  asuncionGuideArticle,
  impeachmentArticle,
  uenoBankArticle,
  foreignInvestorArticle,
];

export function getTranslatedArticle(slug: string) {
  const article = TRANSLATED_ARTICLES.find((item) => item.slug === slug);
  if (!article) throw new Error(`Artículo desconocido: ${slug}`);
  return article;
}

export {
  asuncionGuideArticle,
  deedCostArticle,
  offPlanArticle,
  foreignInvestorArticle,
  impeachmentArticle,
  investmentGradeArticle,
  neighborhoodPricesArticle,
  uenoBankArticle,
};
export type { ArticleDefinition } from "@/lib/content/articles/types";
