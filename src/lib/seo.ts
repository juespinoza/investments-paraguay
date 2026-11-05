import { resolveImageSource } from "@/lib/image-source";
import type { Metadata } from "next";
import {
  DEFAULT_LOCALE,
  OPEN_GRAPH_LOCALES,
  SUPPORTED_LOCALES,
  type AppLocale,
} from "@/lib/i18n";

export const SITE_URL = "https://www.investmentsparaguay.com";
export const SITE_NAME = "Investments Paraguay";
export const SEO_LOCALES = SUPPORTED_LOCALES;

const MAX_DESCRIPTION_LENGTH = 155;

// Google corta las descripciones a ~155 caracteres. Cortamos en un límite de
// palabra para que el fragmento no termine a mitad de palabra.
export function truncateDescription(
  value: string,
  maxLength = MAX_DESCRIPTION_LENGTH,
) {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;

  const slice = normalized.slice(0, maxLength - 1);
  const lastSpace = slice.lastIndexOf(" ");
  const cut = lastSpace > maxLength * 0.6 ? slice.slice(0, lastSpace) : slice;
  return `${cut.replace(/[\s.,;:–-]+$/, "")}…`;
}

type SeoInput = {
  title: string;
  description: string;
  pathname?: string;
  locale?: AppLocale;
  image?: string;
  noIndex?: boolean;
  keywords?: string[];
  // Contenido escrito en un solo idioma (artículos del blog): la URL
  // canónica apunta a ese idioma y no se declaran traducciones inexistentes.
  contentLocale?: AppLocale;
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
    SEO_LOCALES.map((locale) => [
      locale,
      normalizeUrl(withLocalePrefix(locale, pathname)),
    ]),
  );
  return {
    ...languages,
    "x-default": normalizeUrl(withLocalePrefix(DEFAULT_LOCALE, pathname)),
  };
}

function resolveMetadataImageUrl(image: string) {
  image = resolveImageSource(image);
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  if (image.startsWith("/")) {
    return `${SITE_URL}${image}`;
  }

  const cloudName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "din9bhvas";
  const publicId = image
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  const versionPrefix = /^v\d+\//.test(publicId) ? "" : "v1/";

  return `https://res.cloudinary.com/${cloudName}/image/upload/c_fill,w_1200,h_630,g_center/f_auto/q_auto/${versionPrefix}${publicId}`;
}

export function buildMetadata({
  title,
  description,
  pathname = "/",
  locale = DEFAULT_LOCALE,
  image = "/images/logo.png",
  noIndex = false,
  keywords = [],
  contentLocale,
}: SeoInput): Metadata {
  const localizedPath = withLocalePrefix(contentLocale ?? locale, pathname);
  const metaDescription = truncateDescription(description);
  const url = normalizeUrl(localizedPath);
  const imageUrl = resolveMetadataImageUrl(image);

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description: metaDescription,
    keywords,
    alternates: contentLocale
      ? { canonical: url }
      : {
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
      locale: OPEN_GRAPH_LOCALES[locale],
      alternateLocale: SEO_LOCALES.filter((item) => item !== locale).map(
        (item) => OPEN_GRAPH_LOCALES[item],
      ),
      url,
      siteName: SITE_NAME,
      title,
      description: metaDescription,
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
      description: metaDescription,
      images: [imageUrl],
    },
  };
}
