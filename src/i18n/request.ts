// src/i18n/request.ts
import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import {
  DEFAULT_LOCALE,
  type AppLocale
} from "@/lib/i18n";
import { routing } from "@/i18n/routing";

export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale;
  const locale: AppLocale = hasLocale(routing.locales, requested)
    ? requested
    : DEFAULT_LOCALE;

  const messages = (await import(`../../messages/${locale}.json`)).default;

  return {
    locale,
    messages,
  };
});
