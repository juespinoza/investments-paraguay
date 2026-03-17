// src/app/(public)/layout.tsx
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import "@/app/globals.css";
import { NavBar } from "@/components/landing/NavBar";
import { Footer } from "@/components/landing/Footer";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { SUPPORTED_LOCALES, type AppLocale } from "@/lib/i18n";

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
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: routeLocale } = await params;

  if (!SUPPORTED_LOCALES.includes(routeLocale as AppLocale)) {
    notFound();
  }

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
