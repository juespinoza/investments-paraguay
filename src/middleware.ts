// src/middleware.ts
import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import {
  isSupportedLocale,
  pickLocaleFromAcceptLanguage,
  type SupportedLocale,
} from "@/lib/i18n";

const intlMiddleware = createMiddleware(routing);

const LEGACY_PUBLIC_PATHS = [
  /^\/$/,
  /^\/blog(?:\/.*)?$/,
  /^\/bienes-raices(?:\/.*)?$/,
  /^\/contacto$/,
  /^\/cookies$/,
  /^\/legales$/,
  /^\/nosotros$/,
  /^\/invertir-en(?:\/.*)?$/,
] as const;

// Orden de preferencia para rutas sin prefijo de idioma:
// 1. Idioma elegido antes con el selector (cookie).
// 2. Idioma del navegador (Accept-Language).
// 3. Español.
function resolveRequestLocale(request: NextRequest): SupportedLocale {
  const cookieLocale = request.cookies.get("locale")?.value;
  if (isSupportedLocale(cookieLocale)) {
    return cookieLocale;
  }

  return pickLocaleFromAcceptLanguage(request.headers.get("accept-language"));
}

function hasLocalePrefix(pathname: string) {
  const segment = pathname.split("/")[1];
  return isSupportedLocale(segment);
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/virtual-office")) {
    return NextResponse.next();
  }

  if (!hasLocalePrefix(pathname)) {
    const isLegacyPublicPath = LEGACY_PUBLIC_PATHS.some((pattern) =>
      pattern.test(pathname),
    );

    if (isLegacyPublicPath) {
      const locale = resolveRequestLocale(request);
      const nextUrl = request.nextUrl.clone();
      nextUrl.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
      // 307: la redirección depende del visitante, no debe cachearse como
      // permanente ni consolidar señales de SEO en un solo idioma.
      const response = NextResponse.redirect(nextUrl, 307);
      response.headers.set("Vary", "Accept-Language, Cookie");
      return response;
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
