export const SUPPORTED_LOCALES = ["en", "es", "pt", "de"] as const;
export const DEFAULT_LOCALE = "en";

export type AppLocale = (typeof SUPPORTED_LOCALES)[number];
