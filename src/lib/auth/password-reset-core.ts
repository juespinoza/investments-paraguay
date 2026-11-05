import { createHash, randomBytes } from "node:crypto";

// Reglas del restablecimiento de contraseña, sin dependencias de la base
// para poder testearlas con node --test.

export const RESET_TOKEN_TTL_MINUTES = 30;
// Máximo de links por usuario en la ventana: evita usar el formulario para
// llenarle la casilla a alguien.
export const RESET_MAX_REQUESTS = 3;
export const RESET_WINDOW_MINUTES = 60;
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 72; // bcrypt ignora lo que pasa de 72 bytes

export function generateResetToken() {
  return randomBytes(32).toString("base64url");
}

export function hashResetToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function isWellFormedToken(token: unknown): token is string {
  return typeof token === "string" && /^[A-Za-z0-9_-]{43}$/.test(token);
}

export function resetTokenExpiry(now = new Date()) {
  return new Date(now.getTime() + RESET_TOKEN_TTL_MINUTES * 60_000);
}

export type TokenState = "valid" | "expired" | "used" | "invalid";

export function tokenState(
  record: { expiresAt: Date; usedAt: Date | null } | null,
  now = new Date(),
): TokenState {
  if (!record) return "invalid";
  if (record.usedAt) return "used";
  if (record.expiresAt.getTime() <= now.getTime()) return "expired";
  return "valid";
}

export function passwordProblem(password: string): string | null {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres.`;
  }
  if (Buffer.byteLength(password, "utf8") > PASSWORD_MAX_LENGTH) {
    return `La contraseña no puede superar los ${PASSWORD_MAX_LENGTH} caracteres.`;
  }
  return null;
}

// Una sesión (JWT) emitida antes del último cambio de contraseña deja de valer.
// iat viene en segundos; se compara contra el segundo del cambio.
export function sessionIssuedBeforePasswordChange(
  issuedAtSeconds: number | undefined,
  passwordChangedAt: Date | null,
) {
  if (!passwordChangedAt) return false;
  if (typeof issuedAtSeconds !== "number") return true;
  return issuedAtSeconds < Math.floor(passwordChangedAt.getTime() / 1000);
}

// Base del link del email. No se arma con el Host del pedido (se puede
// falsificar): se usa una variable fija o la URL que define Vercel.
export function resetBaseUrl(env: Record<string, string | undefined>, fallback: string) {
  const explicit = env.APP_BASE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");
  if (env.VERCEL_ENV === "preview" && env.VERCEL_URL) {
    return `https://${env.VERCEL_URL}`;
  }
  if (env.NODE_ENV === "development") return "http://localhost:3000";
  return fallback;
}
