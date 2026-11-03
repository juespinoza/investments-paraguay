// Idiomas activos del sitio público. Para sumar uno nuevo:
// 1. Crear messages/<locale>.json (las claves que falten caen al español).
// 2. Agregar el código acá y su etiqueta en LOCALE_LABELS.
// 3. Agregar el contenido de las páginas institucionales en
//    src/lib/content/public-pages.ts (si no existe, se usa inglés).
export const SUPPORTED_LOCALES = ["es", "en", "pt"] as const;
export const DEFAULT_LOCALE = "es";

// Locales con contenido estático escrito (páginas legales, nosotros, etc.).
// "de" tiene textos pero todavía no está activo en el sitio.
export const CONTENT_LOCALES = ["en", "es", "pt", "de"] as const;

export type AppLocale = (typeof CONTENT_LOCALES)[number];
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const LOCALE_LABELS: Record<SupportedLocale, string> = {
  es: "ES",
  en: "EN",
  pt: "PT",
};

// Etiqueta BCP 47 para formatear números y fechas.
export const LOCALE_FORMATS: Record<AppLocale, string> = {
  es: "es-PY",
  en: "en-US",
  pt: "pt-BR",
  de: "de-DE",
};

// Locale de Open Graph (Facebook, WhatsApp, LinkedIn).
export const OPEN_GRAPH_LOCALES: Record<AppLocale, string> = {
  es: "es_PY",
  en: "en_US",
  pt: "pt_BR",
  de: "de_DE",
};

export function isSupportedLocale(value: string | null | undefined): value is SupportedLocale {
  return SUPPORTED_LOCALES.some((locale) => locale === value);
}

export function toSupportedLocale(value: string | null | undefined): SupportedLocale {
  return isSupportedLocale(value) ? value : DEFAULT_LOCALE;
}

export function formatLocale(locale: string | null | undefined) {
  return LOCALE_FORMATS[toSupportedLocale(locale)];
}

// Elige el mejor idioma soportado a partir del header Accept-Language.
export function pickLocaleFromAcceptLanguage(
  header: string | null | undefined,
): SupportedLocale {
  if (!header) return DEFAULT_LOCALE;

  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params
        .map((param) => param.trim())
        .find((param) => param.startsWith("q="));
      const quality = q ? Number(q.slice(2)) : 1;
      return {
        language: tag.toLowerCase().split("-")[0],
        quality: Number.isFinite(quality) ? quality : 0,
      };
    })
    .filter((item) => item.language && item.quality > 0)
    .sort((a, b) => b.quality - a.quality);

  const match = ranked.find((item) => isSupportedLocale(item.language));
  return match ? (match.language as SupportedLocale) : DEFAULT_LOCALE;
}
