// src/app/(virtual-office)/virtual-office/login/page.tsx
import LoginClient from "./LoginClient";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Login Oficina virtual | Investments Paraguay",
  description: "Acceso al panel interno.",
  pathname: "/virtual-office/login",
  noIndex: true,
});

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const resolvedSearchParams = await searchParams;
  const next =
    typeof resolvedSearchParams?.next === "string" &&
    resolvedSearchParams.next.trim().length > 0
      ? resolvedSearchParams.next
      : "/virtual-office";

  return <LoginClient nextUrl={next} />;
}
