import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title:
    "Por qué invertir en Paraguay: el nuevo polo inmobiliario de Sudamérica | Investments Paraguay",
  description:
    "Paraguay gana atractivo para inversión inmobiliaria por estabilidad, inflación controlada e incentivos. Claves, riesgos y checklist para invertir mejor.",
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
  openGraph: {
    title: "Paraguay: nuevo polo de inversión inmobiliaria en Sudamérica",
    description:
      "Factores macro, incentivos y crecimiento urbano: por qué Paraguay atrae inversores inmobiliarios y qué mirar antes de comprar.",
    url: "https://investmentsparaguay.com/blog/paraguay-polo-inversion-inmobiliaria-sudamerica",
    siteName: "Investments Paraguay",
    images: [
      {
        url: "https://investmentsparaguay.com/images/logo.png",
        width: 350,
        height: 110,
      },
    ],
    type: "article",
    tags: ["Paraguay", "Inversiones", "Inmobiliario", "Asunción"],
  },
  twitter: {
    title: "Paraguay: nuevo polo de inversión inmobiliaria en Sudamérica",
    description:
      "Factores macro, incentivos y crecimiento urbano: por qué Paraguay atrae inversores inmobiliarios y qué mirar antes de comprar.",
  },
};

export default function BlogLayout({ children }: { children: ReactNode }) {
  return <main>{children}</main>;
}
