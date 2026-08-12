// TODO(i18n): Reactivar ["en", "pt", "de"] cuando el contenido público esté
// traducido y validado. Por ahora la web opera en español para evitar
// expectativas incorrectas en el navbar, sitemap y metadata.
// export const SUPPORTED_LOCALES = ["en", "es", "pt", "de"] as const;
// export const DEFAULT_LOCALE = "en";
export const SUPPORTED_LOCALES = ["es"] as const;
export const DEFAULT_LOCALE = "es";

export const CONTENT_LOCALES = ["en", "es", "pt", "de"] as const;

export type AppLocale = (typeof CONTENT_LOCALES)[number];
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export function isSupportedLocale(value: string): value is SupportedLocale {
  return SUPPORTED_LOCALES.some((locale) => locale === value);
}
