// Idiomas a los que se traduce el contenido cargado en español.
export const TRANSLATED_LOCALES = ["en", "pt"] as const;
export type TranslatedLocale = (typeof TRANSLATED_LOCALES)[number];
