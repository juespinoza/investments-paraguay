import "@/app/globals.css";
import { cormorantGaramond, dmSans } from "@/app/fonts";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Oficina virtual | Investments Paraguay",
  description: "Panel interno de gestión.",
  pathname: "/virtual-office",
  noIndex: true,
});

export default async function VirtualOfficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${dmSans.variable} ${cormorantGaramond.variable}`}>
        {children}
      </body>
    </html>
  );
}
