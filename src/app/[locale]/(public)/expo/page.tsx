import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { resolveLocale } from "@/lib/content/public-pages";
import data from "./data.json";
import { ExpoProjectsClient, type ExpoProjectsData } from "./ExpoProjectsClient";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale: routeLocale } = await params;
  const locale = resolveLocale(routeLocale);

  return buildMetadata({
    title: "Expo Proyectos | Investments Paraguay",
    description:
      "Explora proyectos inmobiliarios destacados en Paraguay, sus tipologías, espacios, financiación y asesores.",
    pathname: "/expo",
    locale,
    keywords: [
      "expo proyectos paraguay",
      "proyectos inmobiliarios paraguay",
      "inversión inmobiliaria paraguay",
      "departamentos paraguay",
    ],
  });
}

export default function ExpoProyectosPage() {
  return <ExpoProjectsClient data={data as ExpoProjectsData} />;
}
