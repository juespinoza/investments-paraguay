import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { NavBar } from "@/components/landing/NavBar";
import { Footer } from "@/components/landing/Footer";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";

export async function PublicShell({
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
      {children}
      <Footer />
    </NextIntlClientProvider>
  );
}
