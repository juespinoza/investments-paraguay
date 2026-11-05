import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import ForgotPasswordClient from "./ForgotPasswordClient";

export const metadata: Metadata = buildMetadata({
  title: "Olvidé mi contraseña | Investments Paraguay",
  description: "Restablecer el acceso a la oficina virtual.",
  pathname: "/virtual-office/olvide-contrasena",
  noIndex: true,
});

export default function ForgotPasswordPage() {
  return <ForgotPasswordClient />;
}
