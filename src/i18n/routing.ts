import {defineRouting} from "next-intl/routing";
import {DEFAULT_LOCALE, SUPPORTED_LOCALES} from "@/lib/i18n";

export const routing = defineRouting({
  locales: [...SUPPORTED_LOCALES],
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: "always",
  // TODO(i18n): Volver a `true` cuando existan traducciones reales para los
  // idiomas comentados en src/lib/i18n.ts.
  localeDetection: false,
  localeCookie: {
    name: "locale",
    maxAge: 60 * 60 * 24 * 365,
  },
});
