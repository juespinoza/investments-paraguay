import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildMetadata, SITE_NAME, SITE_URL } from "@/lib/seo";

const pathname = "/blog/paraguay-polo-inversion-inmobiliaria-sudamerica";

const baseMetadata = buildMetadata({
  title:
    "Por qué invertir en Paraguay: el nuevo polo inmobiliario de Sudamérica | Investments Paraguay",
  description:
    "Paraguay gana atractivo para inversión inmobiliaria por estabilidad, inflación controlada e incentivos. Claves, riesgos y checklist para invertir mejor.",
  pathname,
  locale: "es",
  image: "/images/logo.png",
  keywords: [
    "inversiones Paraguay",
    "inversión inmobiliaria Paraguay",
    "comprar departamento Asunción",
    "real estate Paraguay",
    "mercado inmobiliario Asunción",
    "invertir en Sudamérica",
    "renta Paraguay",
    "plusvalía Asunción",
    "Paraguay inversión extranjera",
    "ley 60/90 Paraguay",
  ],
});

export const metadata: Metadata = {
  ...baseMetadata,
  openGraph: {
    ...baseMetadata.openGraph,
    type: "article",
    url: `${SITE_URL}/es${pathname}`,
    siteName: SITE_NAME,
  },
};

export default function BlogLayout({ children }: { children: ReactNode }) {
  return <main>{children}</main>;
}
