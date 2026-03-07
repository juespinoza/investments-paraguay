import type { Metadata } from "next";
import "./globals.css";
import { inter, playfair } from "./fonts";
import { getLocale } from "next-intl/server";
import { buildMetadata, SITE_NAME, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  ...buildMetadata({
    title:
      "Investments Paraguay | Real Estate & Business Opportunities in Paraguay",
    description:
      "Explore real estate investment opportunities, business ideas and strategic advisory for investors in Paraguay.",
    pathname: "/",
    locale: "en",
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
      <body className={`${inter.variable} ${playfair.variable}`}>
        {children}
      </body>
    </html>
  );
}
