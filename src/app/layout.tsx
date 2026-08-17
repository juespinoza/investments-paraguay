import type { Metadata } from "next";
import "./globals.css";
import { cormorantGaramond, dmSans } from "./fonts";
import { getLocale } from "next-intl/server";
import { buildMetadata, SITE_NAME, SITE_URL } from "@/lib/seo";
import { StructuredData } from "@/components/seo/StructuredData";
import { buildOrganizationJsonLd } from "@/lib/structured-data";
import { WhatsAppFloat } from "@/components/landing/WhatsAppFloat";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body className={`${dmSans.variable} ${cormorantGaramond.variable}`}>
        <StructuredData data={buildOrganizationJsonLd()} />
        {children}
        <WhatsAppFloat />
      </body>
    </html>
  );
}
