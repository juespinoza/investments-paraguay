export type WhatsAppLocale = "es" | "en";

export const WHATSAPP_MESSAGES: Record<WhatsAppLocale, string> = {
  es: "Hola, busco asesoría. Fuente: www.investmentsparaguay.com.",
  en: "Hello, I am looking for advisory. Source: www.investmentsparaguay.com.",
};

export const DEFAULT_WHATSAPP_NUMBER = "595985444801";
export const DEFAULT_WHATSAPP_LOCALE: WhatsAppLocale = "es";

function resolveWhatsAppLocale(locale?: string | null): WhatsAppLocale {
  return locale === "en" ? "en" : DEFAULT_WHATSAPP_LOCALE;
}

export function getWhatsAppMessage(locale?: string | null) {
  return WHATSAPP_MESSAGES[resolveWhatsAppLocale(locale)];
}

function withMessage(url: string, message: string) {
  try {
    const parsed = new URL(url);
    parsed.searchParams.set("text", message);
    return parsed.toString();
  } catch {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}text=${encodeURIComponent(message)}`;
  }
}

export function buildWhatsAppHref(
  value = DEFAULT_WHATSAPP_NUMBER,
  locale?: string | null,
) {
  const trimmed = value.trim();
  const message = getWhatsAppMessage(locale);
  const encodedMessage = encodeURIComponent(message);

  if (!trimmed) {
    return `https://wa.me/${DEFAULT_WHATSAPP_NUMBER}?text=${encodedMessage}`;
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return withMessage(trimmed, message);
  }

  const digits = trimmed.replace(/\D/g, "");

  return `https://wa.me/${digits || DEFAULT_WHATSAPP_NUMBER}?text=${encodedMessage}`;
}

export const DEFAULT_WHATSAPP_HREF = buildWhatsAppHref();
