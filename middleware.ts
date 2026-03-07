import createMiddleware from "next-intl/middleware";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/lib/i18n";

export default createMiddleware({
  locales: [...SUPPORTED_LOCALES],
  defaultLocale: DEFAULT_LOCALE,

  // IMPORTANTE: sin prefijos /en /es /pt /de
  localePrefix: "never",

  // Activa detección por Accept-Language + cookie
  localeDetection: true,

  // Usá TU cookie "locale" en vez de NEXT_LOCALE (opcional pero recomendado)
  localeCookie: {
    name: "locale",
    maxAge: 60 * 60 * 24 * 365, // 1 año
  },
});

export const config = {
  matcher: ["/virtual-office/:path*", "/((?!api|_next|.*\\..*).*)"],
};
