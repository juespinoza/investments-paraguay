import { NextResponse } from "next/server";
import { listPublicProperties } from "@/lib/properties/public";

function normalize(value: string | null | undefined) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = normalize(url.searchParams.get("q")).trim();
  const min = Number(url.searchParams.get("min") ?? "");
  const max = Number(url.searchParams.get("max") ?? "");

  const properties = await listPublicProperties();

  const response = properties.filter((property) => {
    if (Number.isFinite(min) && min > 0) {
      if (property.priceUsd === null || property.priceUsd < min) return false;
    }

    if (Number.isFinite(max) && max > 0) {
      if (property.priceUsd === null || property.priceUsd > max) return false;
    }

    if (q) {
      const haystack = [
        property.title,
        property.city,
        property.neighborhood,
        property.subtitle,
      ]
        .map(normalize)
        .join(" ");
      if (!haystack.includes(q)) return false;
    }

    return true;
  });

  return NextResponse.json(response);
}
