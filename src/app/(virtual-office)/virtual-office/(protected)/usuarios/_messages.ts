// Mensajes según el resultado de enviar un email de invitación o de
// confirmación. Los usan la lista y la edición de usuarios.
export function emailResultAlert(
  kind: "invite" | "email-change",
  result: string | undefined,
): { type: "success" | "warning"; message: string } | null {
  if (!result || result === "unchanged") return null;
  if (result === "sent") {
    return {
      type: "success",
      message:
        kind === "invite"
          ? "Le enviamos una invitación por email para activar la cuenta y elegir su contraseña."
          : "Le enviamos un link al email nuevo. El cambio se aplica cuando se confirme desde esa casilla; mientras tanto sigue valiendo el email anterior.",
    };
  }
  if (result === "rate_limited") {
    return {
      type: "warning",
      message: "Ya se enviaron varios emails a esta cuenta en la última hora. Esperá un rato y reenvialo desde la edición del usuario.",
    };
  }
  return {
    type: "warning",
    message:
      "No se pudo enviar el email (el envío no está configurado o falló). Revisá RESEND_API_KEY y EMAIL_FROM, y reenvialo desde la edición del usuario.",
  };
}
