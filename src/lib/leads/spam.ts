// Reglas anti-spam de los formularios de leads. Se usan en el navegador
// (nombres de los campos) y en la API (decisión). No importa nada del
// servidor para poder compartirse.

// Campo trampa: oculto para las personas, los bots lo completan.
export const HONEYPOT_FIELD = "company_website";

// Una persona tarda más que esto en completar el formulario.
export const MIN_FILL_MS = 2500;

export type LeadGuard = {
  _hp?: string;
  _elapsed?: number;
};

export type SpamVerdict =
  | { kind: "drop"; reason: string }
  | { kind: "suspicious"; reason: string }
  | { kind: "ok" };

// Nombre sin espacios, solo letras y con mayúsculas mezcladas al azar,
// por ejemplo "RTGxfdZRBzDJltWEBavWvpUE".
export function isRandomName(name: string) {
  const value = name.trim();
  if (value.length < 12 || /\s/.test(value) || !/^[A-Za-z]+$/.test(value)) {
    return false;
  }
  const caseSwitches = value.match(/[a-z][A-Z]/g)?.length ?? 0;
  return caseSwitches >= 3;
}

// Gmail con puntos intercalados ("e.t.o.zuj.at8.10@gmail.com"): Gmail
// ignora los puntos y los bots los usan para variar la misma dirección.
export function isDottedGmail(email: string | null | undefined) {
  if (!email) return false;
  const [local, domain] = email.trim().toLowerCase().split("@");
  if (!local || (domain !== "gmail.com" && domain !== "googlemail.com")) {
    return false;
  }
  return (local.match(/\./g)?.length ?? 0) >= 3;
}

export function evaluateLead(input: {
  fullName: string;
  email?: string | null;
  guard: LeadGuard;
}): SpamVerdict {
  const { guard } = input;
  if (guard._hp && guard._hp.trim() !== "") {
    return { kind: "drop", reason: "honeypot" };
  }
  if (typeof guard._elapsed !== "number") {
    return { kind: "drop", reason: "sin_formulario" };
  }
  if (guard._elapsed < MIN_FILL_MS) {
    return { kind: "drop", reason: "demasiado_rapido" };
  }
  if (isRandomName(input.fullName)) {
    return { kind: "suspicious", reason: "nombre_aleatorio" };
  }
  if (isDottedGmail(input.email)) {
    return { kind: "suspicious", reason: "gmail_con_puntos" };
  }
  return { kind: "ok" };
}
