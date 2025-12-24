import type { Metadata } from "next";
import "@/app/globals.css";
import { inter, playfair } from "@/app/fonts";
import { NavBar } from "@/components/landing/NavBar";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Investments Paraguay",
  description: "Check out investment opportunities in Paraguay.",
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable}`}>
        <div className="min-h-screen bg-base text-main">
          <NavBar />
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
