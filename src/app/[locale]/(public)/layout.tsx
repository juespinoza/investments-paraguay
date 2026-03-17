// src/app/(public)/layout.tsx
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "@/app/globals.css";
import { NavBar } from "@/components/landing/NavBar";
import { Footer } from "@/components/landing/Footer";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";

export const metadata: Metadata = buildMetadata({
  title:
    "Investments Paraguay | Invest in Real Estate and Business in Paraguay",
  description:
    "Discover profitable real estate investments, business opportunities and strategic advisory services for local and foreign investors in Paraguay.",
  pathname: "/",
  locale: "en",
  keywords: [
    "investments Paraguay",
    "real estate investment Paraguay",
    "foreign investors Paraguay",
    "business opportunities in Paraguay",
    "Paraguay real estate advisor",
  ],
});

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <GoogleAnalytics locale={locale} />
      <NavBar />
      <main className="pb-8">{children}</main>
      <Footer />
    </NextIntlClientProvider>
  );
}
