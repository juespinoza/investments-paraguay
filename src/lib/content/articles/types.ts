import type { SupportedLocale } from "@/lib/i18n";

// Artículos fijos traducidos. El texto admite **negrita** y
// [enlaces](https://...). El bloque "cta" muestra el llamado a la acción
// intermedio (llamada, WhatsApp y guía).

export type ArticleBlock =
  | { type: "h2"; id: string; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "table"; head: string[]; rows: string[][]; note?: string }
  | { type: "callout"; title: string; text: string }
  | { type: "cta" };

export type ArticleSource = { label: string; url: string };

export type LocalizedArticle = {
  title: string;
  metaTitle: string;
  description: string;
  excerpt: string;
  lead: string;
  readingTime: string;
  updatedLabel: string;
  authorRole: string;
  tocTitle: string;
  sourcesTitle: string;
  disclaimer: string;
  cta: {
    title: string;
    text: string;
    guide: string;
    call: string;
    whatsapp: string;
    whatsappMessage: string;
  };
  blocks: ArticleBlock[];
};

// Imagen principal: portada en el blog, cabecera del artículo y vista previa
// al compartir. Archivos en /public/blog.
export type ArticleCover = {
  src: string; // ancho completo (webp)
  og: string; // 1200×630 para redes (jpg)
  width: number;
  height: number;
  alt: Record<SupportedLocale, string>;
};

export type ArticleDefinition = {
  slug: string;
  cover?: ArticleCover;
  published: string;
  updated: string;
  category: "market" | "strategy" | "guides";
  sources: ArticleSource[];
  content: Record<SupportedLocale, LocalizedArticle>;
};
