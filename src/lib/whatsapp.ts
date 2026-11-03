export type WhatsAppLocale = "es" | "en" | "pt";

export const WHATSAPP_MESSAGES: Record<WhatsAppLocale, string> = {
  es: "Hola, busco asesoría. Fuente: www.investmentsparaguay.com.",
  en: "Hello, I am looking for advisory. Source: www.investmentsparaguay.com.",
  pt: "Olá, procuro assessoria. Fonte: www.investmentsparaguay.com.",
};

// Mensaje precargado desde la ficha de una propiedad. Así el lead llega con
// contexto y se puede saber qué ficha generó la conversación.
const PROPERTY_MESSAGES: Record<
  WhatsAppLocale,
  (property: WhatsAppPropertyContext) => string
> = {
  es: ({ title, url }) =>
    `Hola, me interesa la propiedad "${title}". ¿Me pasás más información? ${url}`,
  en: ({ title, url }) =>
    `Hello, I am interested in the property "${title}". Could you send me more information? ${url}`,
  pt: ({ title, url }) =>
    `Olá, tenho interesse no imóvel "${title}". Pode me enviar mais informações? ${url}`,
};

export type WhatsAppPropertyContext = {
  title: string;
  url: string;
};

export const DEFAULT_WHATSAPP_NUMBER = "595985444801";
export const DEFAULT_WHATSAPP_LOCALE: WhatsAppLocale = "es";

function resolveWhatsAppLocale(locale?: string | null): WhatsAppLocale {
  return locale === "en" || locale === "pt" ? locale : DEFAULT_WHATSAPP_LOCALE;
}

export function getWhatsAppMessage(
  locale?: string | null,
  property?: WhatsAppPropertyContext,
) {
  const resolved = resolveWhatsAppLocale(locale);
  return property
    ? PROPERTY_MESSAGES[resolved](property)
    : WHATSAPP_MESSAGES[resolved];
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
  property?: WhatsAppPropertyContext,
) {
  const trimmed = value.trim();
  const message = getWhatsAppMessage(locale, property);
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

export function isWhatsAppHref(href: string | null | undefined) {
  return Boolean(
    href && (href.includes("wa.me/") || href.includes("api.whatsapp.com/")),
  );
}

export const DEFAULT_WHATSAPP_HREF = buildWhatsAppHref();
