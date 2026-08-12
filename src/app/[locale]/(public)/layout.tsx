// src/app/(public)/layout.tsx
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import "@/app/globals.css";
import { NavBar } from "@/components/landing/NavBar";
import { Footer } from "@/components/landing/Footer";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { isSupportedLocale } from "@/lib/i18n";

export default async function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: routeLocale } = await params;

  if (!isSupportedLocale(routeLocale)) {
    notFound();
  }

  const locale = routeLocale;
  setRequestLocale(locale);
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
