// src/middleware.ts
import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/lib/i18n";

const intlMiddleware = createMiddleware({
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

export default function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/virtual-office")) {
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
