import type { Metadata } from "next";
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  type AppLocale,
} from "@/lib/i18n";

export const SITE_URL = "https://www.investmentsparaguay.com";
export const SITE_NAME = "Investments Paraguay";

type SeoInput = {
  title: string;
  description: string;
  pathname?: string;
  locale?: AppLocale;
  image?: string;
  noIndex?: boolean;
  keywords?: string[];
};

function normalizeUrl(pathname = "") {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${SITE_URL}${path === "/" ? "" : path}`;
}

function withLocalePrefix(locale: AppLocale, pathname: string) {
  const canonicalPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const path = canonicalPath === "/" ? "" : canonicalPath;
  return `/${locale}${path}`;
}

function buildLanguageAlternates(pathname: string) {
  const languages = Object.fromEntries(
    SUPPORTED_LOCALES.map((locale) => [locale, withLocalePrefix(locale, pathname)]),
  );
  return {
    ...languages,
    "x-default": withLocalePrefix(DEFAULT_LOCALE, pathname),
  };
}

export function buildMetadata({
  title,
  description,
  pathname = "/",
  locale = DEFAULT_LOCALE,
  image = "/images/logo.png",
  noIndex = false,
  keywords = [],
}: SeoInput): Metadata {
  const localizedPath = withLocalePrefix(locale, pathname);
  const url = normalizeUrl(localizedPath);
  const imageUrl = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
      languages: buildLanguageAlternates(pathname),
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    openGraph: {
      type: "website",
      locale,
      url,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}
