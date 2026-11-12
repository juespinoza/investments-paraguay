import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { cormorantGaramond, dmSans } from "@/app/fonts";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { Footer } from "@/components/landing/Footer";
import { NavBar } from "@/components/landing/NavBar";
import { WhatsAppFloat } from "@/components/landing/WhatsAppFloat";
import { StructuredData } from "@/components/seo/StructuredData";
import { isSupportedLocale, SUPPORTED_LOCALES } from "@/lib/i18n";
import { buildMetadata, SITE_NAME, SITE_URL } from "@/lib/seo";
import { buildOrganizationJsonLd } from "@/lib/structured-data";

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

// Metadatos por defecto para las páginas que no definen los suyos.
export const metadata: Metadata = {
  ...buildMetadata({
    title:
      "Real Estate & Business Opportunities in Paraguay | Investments Paraguay",
    description:
      "Explore real estate investment opportunities, business ideas and strategic advisory for investors in Paraguay.",
    pathname: "/",
    locale: "en",
    image: "/images/og-home.jpg",
    keywords: [
      "investments in Paraguay",
      "real estate Paraguay",
      "property investment Paraguay",
      "business opportunities Paraguay",
      "invest in Paraguay",
    ],
  }),
  applicationName: SITE_NAME,
  category: "business",
  creator: SITE_NAME,
  publisher: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  icons: {
    icon: [{ url: "/favicon.ico" }],
  },
};

// Los tres idiomas se generan en el build; así las páginas pueden quedar en
// la caché de Vercel y regenerarse según su revalidate.
export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale: routeLocale } = await params;

  if (!isSupportedLocale(routeLocale)) {
    notFound();
  }

  setRequestLocale(routeLocale);
  const messages = await getMessages();

  return (
    <html lang={routeLocale}>
      <body className={`${dmSans.variable} ${cormorantGaramond.variable}`}>
        <StructuredData data={buildOrganizationJsonLd()} />
        <NextIntlClientProvider locale={routeLocale} messages={messages}>
          {/* Suspense: GoogleAnalytics lee los parámetros de la URL, que no
              existen al generar la página estática. */}
          <Suspense fallback={null}>
            <GoogleAnalytics locale={routeLocale} />
          </Suspense>
          <NavBar />
          <main className="pb-8">{children}</main>
          <Footer />
        </NextIntlClientProvider>
        <WhatsAppFloat />
      </body>
    </html>
  );
}
