"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ImageCloudinary } from "@/components/ui/ImageCloudinary";
import { cn } from "@/lib/cn";
import type { PublicPropertyListItem } from "@/lib/api/types";
import { resolvePropertyListingType } from "@/lib/properties/listing-type";
import { formatLocale } from "@/lib/i18n";
import { formatPropertyPrice } from "@/lib/properties/format";

type PropertyCardProps = {
  property: PublicPropertyListItem;
  priority?: boolean;
};

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
  const t = useTranslations("site.property");
  const tStatus = useTranslations("site.status");
  const locale = useLocale();
  const numberFormat = formatLocale(locale);
  const title = property.titleTranslations?.[locale] ?? property.title;
  const price = formatPropertyPrice(
    property.price ?? property.priceUsd,
    property.currency,
    locale,
  );
  const roi =
    property.roiAnnualPct === null
      ? null
      : t("roi", {
          value: property.roiAnnualPct.toLocaleString(numberFormat, {
            maximumFractionDigits: 1,
          }),
        });
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
        aria-label={t("viewPropertyAria", { title })}
      >
        <PropertyCardImage
          src={imageUrl}
          alt={t("coverAlt", { title })}
          priority={priority}
        />
        <span className="absolute left-4 top-4 rounded-xs bg-[rgba(10,10,10,0.72)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-white backdrop-blur-sm">
          {property.status
            ? tStatus(property.status)
            : listingType === "alquiler"
              ? t("rent")
              : t("sale")}
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
            {title}
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
            {t("viewProperty")}
            <ArrowRight size={15} strokeWidth={1.8} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
