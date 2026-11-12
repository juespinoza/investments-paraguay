// Limpieza de textos que llegan del publicador (portal SkyOne) o de la
// oficina virtual antes de mostrarlos en el sitio o enviarlos a Google.

const LOWERCASE_WORDS = new Set([
  "a", "al", "con", "de", "del", "e", "el", "en", "la", "las", "lo", "los",
  "o", "para", "por", "u", "un", "una", "y", "sin", "sobre", "desde", "hasta",
]);

// Siglas que se dejan en mayúsculas al pasar un título a formato normal.
const KEEP_UPPERCASE = new Set([
  "MRA", "CDE", "USD", "GS", "PY", "ROI", "II", "III", "IV", "KM", "M2",
]);

function isMostlyUppercase(value: string) {
  const letters = value.replace(/[^\p{L}]/gu, "");
  if (letters.length < 6) return false;
  const upper = letters.replace(/[^\p{Lu}]/gu, "").length;
  return upper / letters.length > 0.7;
}

// "VENDO DEPARTAMENTO MONOAMBIENTE EN VILLA MORRA" →
// "Vendo Departamento Monoambiente en Villa Morra". Los títulos que ya
// vienen en formato normal no se tocan.
export function formatPropertyTitle(title: string) {
  const trimmed = title.trim().replace(/\s+/g, " ");
  if (!isMostlyUppercase(trimmed)) return trimmed;

  return trimmed
    .split(" ")
    .map((word, index) => {
      if (KEEP_UPPERCASE.has(word)) return word;
      const lower = word.toLocaleLowerCase("es");
      if (index > 0 && LOWERCASE_WORDS.has(lower)) return lower;
      return lower.charAt(0).toLocaleUpperCase("es") + lower.slice(1);
    })
    .join(" ");
}

const EMOJI_PATTERN =
  /[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}\u{FE0F}\u{200D}\u{20E3}]/gu;

// Texto plano para metadatos y datos estructurados: sin HTML, markdown,
// viñetas ni emojis.
export function toPlainText(value: string) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(EMOJI_PATTERN, "")
    .replace(/\*\*|__|\*|`/g, "")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/^\s*(?:[-•–·]|\d+[.)])\s+/gm, "")
    .replace(/\s+/g, " ")
    .replace(/\s+([.,;:])/g, "$1")
    .trim();
}

export function truncateText(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;
  const cut = value.slice(0, maxLength - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > maxLength * 0.6 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}

// Un ROI o una plusvalía en 0 o negativos significan "sin dato": no se
// muestran ni se envían a Google.
export function positiveOrNull(value: number | null) {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? value
    : null;
}
