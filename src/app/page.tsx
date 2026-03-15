import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { NavBar } from "@/components/landing/NavBar";
import { Footer } from "@/components/landing/Footer";
import { HomePageContent } from "@/components/landing/HomePageContent";

export default async function RootHomePage() {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <NavBar />
      <main className="pb-8">
        <HomePageContent />
      </main>
      <Footer />
    </NextIntlClientProvider>
  );
}
