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

export type ArticleDefinition = {
  slug: string;
  published: string;
  updated: string;
  category: "market" | "strategy" | "guides";
  sources: ArticleSource[];
  content: Record<SupportedLocale, LocalizedArticle>;
};
