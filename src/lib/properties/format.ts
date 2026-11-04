import { formatLocale } from "@/lib/i18n";

export type PropertyCurrency = "GS" | "USD";

// Precio con su moneda, formateado según el idioma de la página
// (es: USD 46.500 · en: USD 46,500). Guaraníes sin decimales.
export function formatPropertyPrice(
  price: number | null | undefined,
  currency: PropertyCurrency | null | undefined,
  locale: string,
) {
  if (typeof price !== "number" || !Number.isFinite(price)) return null;

  const resolvedCurrency = currency ?? "USD";
  const amount = price.toLocaleString(formatLocale(locale), {
    maximumFractionDigits: resolvedCurrency === "USD" ? 2 : 0,
  });

  return `${resolvedCurrency} ${amount}`;
}
