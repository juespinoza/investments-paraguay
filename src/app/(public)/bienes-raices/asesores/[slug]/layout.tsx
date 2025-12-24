import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Julia Espinoza | Investments Paraguay",
  description:
    "Asesora inmobiliaria especializada en inversiones inteligentes en Paraguay. Conéctate con Julia para descubrir oportunidades de inversión excepcionales.",
};

export default function AsesorLayout({
  children,
  slug,
}: {
  children: React.ReactNode;
  slug: string;
}) {
  return <div>{children}</div>;
}
