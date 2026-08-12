// src/middleware.ts
import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import {
  DEFAULT_LOCALE,
  isSupportedLocale,
  type AppLocale,
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
] as const;

function pickFromAcceptLanguage(value: string | null): AppLocale {
  // TODO(i18n): Volver a leer Accept-Language cuando se reactiven en/pt/de.
  // Mientras el contenido siga en español, todas las rutas públicas deben
  // resolver al locale principal para evitar URLs con contenido inconsistente.
  void value;
  return DEFAULT_LOCALE;
}

function resolveRequestLocale(request: NextRequest): AppLocale {
  const cookieLocale = request.cookies.get("locale")?.value;
  // TODO(i18n): Las cookies de idiomas anteriores pueden quedar en navegadores.
  // Solo se respetan cuando el locale vuelve a estar activo en SUPPORTED_LOCALES.
  if (cookieLocale && isSupportedLocale(cookieLocale)) {
    return cookieLocale;
  }

  return pickFromAcceptLanguage(request.headers.get("accept-language"));
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
      return NextResponse.redirect(nextUrl, 308);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
