import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { Footer } from "@/components/landing/Footer";
import { NavBar } from "@/components/landing/NavBar";
import { isSupportedLocale } from "@/lib/i18n";

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

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
    <NextIntlClientProvider locale={routeLocale} messages={messages}>
      <GoogleAnalytics locale={routeLocale} />
      <NavBar />
      <main className="pb-8">{children}</main>
      <Footer />
    </NextIntlClientProvider>
  );
}
