// Reglas de los links de confirmación de email (sin base de datos, testeables).

export const INVITE_TTL_HOURS = 72;
export const EMAIL_CHANGE_TTL_HOURS = 24;
export const EMAIL_TOKEN_MAX_REQUESTS = 3;
export const EMAIL_TOKEN_WINDOW_MINUTES = 60;

export function expiryAfterHours(hours: number, now = new Date()) {
  return new Date(now.getTime() + hours * 3_600_000);
}

// Un link solo vale para la dirección a la que se envió:
// - invitación: si el email de la cuenta cambió después, el link ya no sirve.
// - cambio de email: tiene que seguir siendo el email pendiente de la cuenta.
export function emailTokenMatchesUser(
  purpose: "INVITE" | "EMAIL_CHANGE",
  tokenEmail: string,
  user: { email: string; pendingEmail: string | null },
) {
  return purpose === "INVITE"
    ? tokenEmail === user.email
    : tokenEmail === user.pendingEmail;
}

// Oculta parte del email para mostrarlo sin exponerlo completo: ju***@gmail.com
export function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  if (!domain) return "***";
  const visible = local.slice(0, Math.min(2, Math.max(1, local.length - 1)));
  return `${visible}***@${domain}`;
}
