import type { Metadata } from "next";
import NextLink from "next/link";
import { buildMetadata } from "@/lib/seo";
import { checkResetToken } from "@/lib/auth/password-reset";
import { AuthCard } from "@/components/virtualoffice/AuthCard";
import ResetPasswordClient from "./ResetPasswordClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Nueva contraseña | Investments Paraguay",
    description: "Elegir una nueva contraseña para la oficina virtual.",
    pathname: "/virtual-office/restablecer-contrasena",
    noIndex: true,
  }),
  // El token va en la URL: que no se filtre a otros sitios por el Referer.
  referrer: "no-referrer",
};

const STATE_MESSAGES = {
  invalid: "El link no es válido.",
  expired: "El link venció (dura 30 minutos).",
  used: "Este link ya se usó.",
} as const;

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { token } = await searchParams;
  const state = await checkResetToken(token);

  if (state !== "valid" || typeof token !== "string") {
    return (
      <AuthCard title="Nueva contraseña">
        <p role="alert" className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {STATE_MESSAGES[state === "valid" ? "invalid" : state]} Pedí uno nuevo.
        </p>
        <p className="mt-6 text-center text-sm">
          <NextLink
            href="/virtual-office/olvide-contrasena"
            className="text-secondary underline underline-offset-4 hover:text-primary"
          >
            Pedir un link nuevo
          </NextLink>
        </p>
      </AuthCard>
    );
  }

  return <ResetPasswordClient token={token} />;
}
