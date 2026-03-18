// src/middleware.ts
import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type AppLocale } from "@/lib/i18n";

const intlMiddleware = createMiddleware(routing);

const LEGACY_PUBLIC_PATHS = [
  /^\/$/,
  /^\/blog(?:\/.*)?$/,
  /^\/bienes-raices(?:\/.*)?$/,
  /^\/contacto$/,
  /^\/cookies$/,
  /^\/legales$/,
  /^\/nosotros$/,
] as const;

function pickFromAcceptLanguage(value: string | null): AppLocale {
  if (!value) return DEFAULT_LOCALE;

  const langs = value
    .split(",")
    .map((part) => part.split(";")[0]?.trim().toLowerCase())
    .filter(Boolean);

  if (langs.some((l) => l === "es" || l.startsWith("es-"))) return "es";
  if (langs.some((l) => l === "pt" || l.startsWith("pt-"))) return "pt";
  if (langs.some((l) => l === "de" || l.startsWith("de-"))) return "de";
  if (langs.some((l) => l === "en" || l.startsWith("en-"))) return "en";
  return DEFAULT_LOCALE;
}

function resolveRequestLocale(request: NextRequest): AppLocale {
  const cookieLocale = request.cookies.get("locale")?.value;
  if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale as AppLocale)) {
    return cookieLocale as AppLocale;
  }

  return pickFromAcceptLanguage(request.headers.get("accept-language"));
}

function hasLocalePrefix(pathname: string) {
  const segment = pathname.split("/")[1];
  return SUPPORTED_LOCALES.includes(segment as AppLocale);
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
      return NextResponse.redirect(nextUrl, 308);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
