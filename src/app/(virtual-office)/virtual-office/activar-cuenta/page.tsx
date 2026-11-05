import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { checkEmailToken } from "@/lib/auth/email-verification";
import { maskEmail } from "@/lib/auth/email-token-core";
import { InvalidLinkCard } from "@/components/virtualoffice/InvalidLinkCard";
import ResetPasswordClient from "../restablecer-contrasena/ResetPasswordClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Activar cuenta | Investments Paraguay",
    description: "Activar la cuenta de la oficina virtual.",
    pathname: "/virtual-office/activar-cuenta",
    noIndex: true,
  }),
  referrer: "no-referrer",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function AcceptInvitationPage({ searchParams }: { searchParams: SearchParams }) {
  const { token } = await searchParams;
  const { state, email } = await checkEmailToken(token, "INVITE");

  if (state !== "valid" || typeof token !== "string" || !email) {
    return (
      <InvalidLinkCard
        title="Activar cuenta"
        state={state}
        hint="Pedile a quien te invitó que te reenvíe la invitación."
      />
    );
  }

  return (
    <ResetPasswordClient
      token={token}
      endpoint="/api/auth/invitation/accept"
      title="Activar cuenta"
      subtitle={`Confirmás que ${maskEmail(email)} es tu email. Elegí tu contraseña (al menos 8 caracteres).`}
      successPath="/virtual-office/login?status=activated"
      retryHref="/virtual-office/login"
    />
  );
}
