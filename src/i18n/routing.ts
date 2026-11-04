import {defineRouting} from "next-intl/routing";
import {DEFAULT_LOCALE, SUPPORTED_LOCALES} from "@/lib/i18n";

export const routing = defineRouting({
  locales: [...SUPPORTED_LOCALES],
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: "always",
  // La detección por Accept-Language se hace en middleware.ts solo para
  // rutas sin prefijo (por ejemplo "/"). Las URLs con /es, /en o /pt nunca
  // se redirigen, así Google indexa cada versión por separado.
  localeDetection: false,
  localeCookie: {
    name: "locale",
    maxAge: 60 * 60 * 24 * 365,
  },
});
