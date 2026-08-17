import type { PublicPropertyListItem } from "@/lib/api/types";

export type PropertyListingType = "venta" | "alquiler";

type PropertyWithListingType = PublicPropertyListItem & {
  listingType?: string | null;
  operationType?: string | null;
  transactionType?: string | null;
};

export function resolvePropertyListingType(
  property: PropertyWithListingType,
): PropertyListingType {
  const rawType =
    property.listingType ?? property.operationType ?? property.transactionType;
  const normalized = rawType?.trim().toLowerCase() ?? "";

  if (["alquiler", "rent", "rental", "lease"].includes(normalized)) {
    return "alquiler";
  }

  return "venta";
}

export function getPropertyListingLabel(type: PropertyListingType) {
  return type === "alquiler" ? "Alquiler" : "Venta";
}
