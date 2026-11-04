// src/i18n/request.ts
import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { DEFAULT_LOCALE, type SupportedLocale } from "@/lib/i18n";
import { routing } from "@/i18n/routing";

type Messages = Record<string, unknown>;

function isPlainObject(value: unknown): value is Messages {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// Completa las claves que falten en un idioma con las del idioma por defecto.
// Permite sumar idiomas nuevos de a poco sin romper páginas.
function withFallback(base: Messages, override: Messages): Messages {
  const result: Messages = { ...base };

  for (const [key, value] of Object.entries(override)) {
    const baseValue = base[key];
    result[key] =
      isPlainObject(baseValue) && isPlainObject(value)
        ? withFallback(baseValue, value)
        : value;
  }

  return result;
}

async function loadMessages(locale: SupportedLocale): Promise<Messages> {
  return (await import(`../../messages/${locale}.json`)).default;
}

export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale;
  const locale: SupportedLocale = hasLocale(routing.locales, requested)
    ? requested
    : DEFAULT_LOCALE;

  const messages =
    locale === DEFAULT_LOCALE
      ? await loadMessages(locale)
      : withFallback(
          await loadMessages(DEFAULT_LOCALE),
          await loadMessages(locale),
        );

  return {
    locale,
    messages,
  };
});
