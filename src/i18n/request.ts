// src/i18n/request.ts
import { cookies, headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  type AppLocale,
} from "@/lib/i18n";

function pickFromAcceptLanguage(value: string | null): AppLocale {
  if (!value) return DEFAULT_LOCALE;

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
  return DEFAULT_LOCALE;
}

export default getRequestConfig(async () => {
  const store = await cookies();
  const cookieLocale = store.get("locale")?.value as AppLocale | undefined;

  const acceptLanguage = (await headers()).get("accept-language");
  const browserLocale = pickFromAcceptLanguage(acceptLanguage);

  const locale: AppLocale =
    cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale)
      ? cookieLocale
      : browserLocale;

  // Load from filesystem
  const messages = (await import(`../../messages/${locale}.json`)).default;

  return {
    locale,
    messages,
  };
});
