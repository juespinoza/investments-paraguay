// src/i18n/request.ts
import { cookies, headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";

const SUPPORTED = ["en", "es", "pt", "de"] as const;
type Locale = (typeof SUPPORTED)[number];

function pickFromAcceptLanguage(value: string | null): Locale {
  if (!value) return "en";

  // Ej: "es-ES,es;q=0.9,en;q=0.8"
  const langs = value
    .split(",")
    .map((part) => part.split(";")[0]?.trim().toLowerCase())
    .filter(Boolean);

  // match simple por prefijo
  if (langs.some((l) => l === "es" || l.startsWith("es-"))) return "es";
  if (langs.some((l) => l === "pt" || l.startsWith("pt-"))) return "pt";
  if (langs.some((l) => l === "de" || l.startsWith("de-"))) return "de";
  if (langs.some((l) => l === "en" || l.startsWith("en-"))) return "en";
  return "en";
}

export default getRequestConfig(async () => {
  const store = await cookies();
  const cookieLocale = store.get("locale")?.value as Locale | undefined;

  const acceptLanguage = (await headers()).get("accept-language");
  const browserLocale = pickFromAcceptLanguage(acceptLanguage);

  const locale: Locale =
    cookieLocale && SUPPORTED.includes(cookieLocale)
      ? cookieLocale
      : browserLocale;

  // Load from filesystem
  const messages = (await import(`../../messages/${locale}.json`)).default;

  return {
    locale,
    messages,
  };
});
