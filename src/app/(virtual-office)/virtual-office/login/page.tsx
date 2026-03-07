// src/app/(virtual-office)/virtual-office/login/page.tsx
import LoginClient from "./LoginClient";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Login Virtual Office | Investments Paraguay",
  description: "Acceso al panel interno.",
  pathname: "/virtual-office/login",
  noIndex: true,
});

type SearchParams = { [key: string]: string | string[] | undefined };

export default function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const next =
    typeof searchParams?.next === "string" &&
    searchParams.next.trim().length > 0
      ? searchParams.next
      : "/virtual-office";

  return <LoginClient nextUrl={next} />;
}
