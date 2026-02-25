// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { inter, playfair } from "./fonts";
import { NextIntlClientProvider } from "next-intl";

export const metadata: Metadata = {
  title: "Investments Paraguay",
  description: "Check out investment opportunities in Paraguay.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable}`}>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
