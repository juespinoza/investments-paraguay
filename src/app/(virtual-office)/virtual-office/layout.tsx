import "@/app/globals.css";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Virtual Office | Investments Paraguay",
  description: "Panel interno de gestión.",
  pathname: "/virtual-office",
  noIndex: true,
});

export default async function VirtualOfficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
