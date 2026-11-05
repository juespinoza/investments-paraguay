import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { checkEmailToken } from "@/lib/auth/email-verification";
import { InvalidLinkCard } from "@/components/virtualoffice/InvalidLinkCard";
import ConfirmEmailClient from "./ConfirmEmailClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Confirmar email | Investments Paraguay",
    description: "Confirmar el nuevo email de la cuenta.",
    pathname: "/virtual-office/confirmar-email",
    noIndex: true,
  }),
  referrer: "no-referrer",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function ConfirmEmailPage({ searchParams }: { searchParams: SearchParams }) {
  const { token } = await searchParams;
  const { state, email } = await checkEmailToken(token, "EMAIL_CHANGE");

  if (state !== "valid" || typeof token !== "string" || !email) {
    return (
      <InvalidLinkCard
        title="Confirmar email"
        state={state}
        hint="Si todavía necesitás el cambio, pedí que lo vuelvan a solicitar desde la oficina virtual."
        action={{ href: "/virtual-office/login", label: "Ir al inicio de sesión" }}
      />
    );
  }

  return <ConfirmEmailClient token={token} email={email} />;
}
