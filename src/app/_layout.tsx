import type { Metadata } from "next";
import "./globals.css";
import { inter, playfair } from "./fonts";

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
        {children}
      </body>
    </html>
  );
}
