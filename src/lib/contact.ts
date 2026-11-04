import { DEFAULT_WHATSAPP_NUMBER } from "@/lib/whatsapp";

// Agenda de Google Calendar para la llamada de 20 minutos.
export const SCHEDULE_CALL_URL = "https://calendar.app.google/cyD3LqbQWsP6yutb8";

// Link de WhatsApp con un mensaje propio (por ejemplo, desde un artículo).
export function buildWhatsAppMessageHref(message: string) {
  return `https://wa.me/${DEFAULT_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
