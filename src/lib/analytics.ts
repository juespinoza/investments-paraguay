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
};
