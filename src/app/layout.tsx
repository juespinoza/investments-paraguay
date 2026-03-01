// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { inter, playfair } from "./fonts";
import { getLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Investments Paraguay",
  description: "Check out investment opportunities in Paraguay.",
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
