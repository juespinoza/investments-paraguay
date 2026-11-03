export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || "";

export function isAnalyticsEnabled() {
  return GA_MEASUREMENT_ID.length > 0;
}

export type AnalyticsEventPayload = {
  event: string;
  category?: string;
  label?: string;
  value?: string | number;
  location?: string;
  href?: string;
  locale?: string;
  path?: string;
  propertySlug?: string;
};

// Eventos que hay que marcar como "evento clave" en GA4
// (Administrar > Eventos clave). Son los que miden leads reales.
export const KEY_EVENTS = {
  whatsappClick: "click_whatsapp",
  lead: "generate_lead",
} as const;

// Envía un evento a GA4 desde el navegador. No hace nada si GA no está
// configurado o el script todavía no cargó.
export function trackEvent(
  name: string,
  params: Record<string, string | number | undefined> = {},
) {
  if (typeof window === "undefined" || !isAnalyticsEnabled()) return;
  window.gtag?.("event", name, params);
}
