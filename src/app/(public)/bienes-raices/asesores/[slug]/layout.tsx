import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Julia Espinoza | Investments Paraguay",
  description:
    "Asesora inmobiliaria especializada en inversiones inteligentes en Paraguay. Conéctate con Julia para descubrir oportunidades de inversión excepcionales.",
};

type Props = {
  children: ReactNode;
};

export default function AsesorLayout({ children }: Props) {
  return <div>{children}</div>;
}
