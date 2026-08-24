"use client";

import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ImageCloudinary } from "@/components/ui/ImageCloudinary";
import { cn } from "@/lib/cn";
import type { PublicPropertyListItem } from "@/lib/api/types";
import {
  getPropertyListingLabel,
  resolvePropertyListingType,
} from "@/lib/properties/listing-type";

type PropertyCardProps = {
  property: PublicPropertyListItem;
  priority?: boolean;
};

function formatPrice(price: number | null, currency: "GS" | "USD") {
  if (price === null) return null;

  return `${currency} ${price.toLocaleString(currency === "USD" ? "en-US" : "es-PY", {
    maximumFractionDigits: currency === "USD" ? 2 : 0,
  })}`;
}

function formatRoi(roiAnnualPct: number | null) {
  if (roiAnnualPct === null) return null;

  return `ROI ~${roiAnnualPct.toLocaleString("es-PY", {
    maximumFractionDigits: 1,
  })}% anual`;
}

function formatLocation(property: PublicPropertyListItem) {
  return [property.neighborhood, property.city].filter(Boolean).join(", ");
}

function PropertyCardImage({
  src,
  alt,
  priority,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  if (src.startsWith("/")) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        priority={priority}
      />
    );
  }

  return <ImageCloudinary imageUrl={src} alt={alt} />;
}

export function PropertyCard({
  property,
  priority = false,
}: PropertyCardProps) {
  const price = formatPrice(property.price ?? property.priceUsd, property.currency);
  const roi = formatRoi(property.roiAnnualPct);
  const location = formatLocation(property);
  const href = `/bienes-raices/propiedades/${property.slug}`;
  const imageUrl = property.coverImageUrl ?? "intentoPortada_wku8ef";
  const hasInvestmentData = Boolean(price || roi);
  const listingType = resolvePropertyListingType(property);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-sm border border-soft bg-(--ivory)">
      <Link
        href={href}
        className="relative block aspect-4/3 overflow-hidden rounded-t-sm bg-(--stone)"
        aria-label={`Ver propiedad ${property.title}`}
      >
        <PropertyCardImage
          src={imageUrl}
          alt={property.title}
          priority={priority}
        />
        <span className="absolute left-4 top-4 rounded-xs bg-[rgba(10,10,10,0.72)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-white backdrop-blur-sm">
          {getPropertyListingLabel(listingType)}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        {hasInvestmentData ? (
          <div>
            {price ? (
              <p className="mb-1 font-cormorant text-[22px] font-normal leading-tight text-primary">
                {price}
              </p>
            ) : null}

            {roi ? (
              <span className="inline-flex w-fit rounded-xs bg-[rgba(191,168,130,0.22)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.05em] text-(--carbon)">
                {roi}
              </span>
            ) : null}
          </div>
        ) : null}

        <h3
          className={cn(
            "text-[15px] font-medium leading-6 text-primary",
            hasInvestmentData && "mt-4",
          )}
        >
          <Link href={href} className="transition-colors hover:text-(--gold)">
            {property.title}
          </Link>
        </h3>

        {location ? (
          <p className="mt-2 flex items-center gap-1.5 text-[12px] leading-5 text-muted">
            <MapPin
              size={14}
              strokeWidth={1.8}
              className="shrink-0 text-(--gold)"
              aria-hidden="true"
            />
            <span>{location}</span>
          </p>
        ) : null}

        <div className="mt-auto pt-5">
          <div className="h-px bg-(--line)" />

          <Link
            href={href}
            className="mt-4 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-primary transition-colors hover:text-(--gold)"
          >
            Ver propiedad
            <ArrowRight size={15} strokeWidth={1.8} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
