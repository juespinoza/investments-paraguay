import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, Check, Download, TriangleAlert } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { PropertyCard } from "@/components/PropertyCard";
import { GuideLeadMagnet } from "@/components/leads/GuideLeadMagnet";
import { StructuredData } from "@/components/seo/StructuredData";
import { Link } from "@/i18n/navigation";
import { buildWhatsAppMessageHref } from "@/lib/contact";
import { SUPPORTED_LOCALES, toSupportedLocale } from "@/lib/i18n";
import { formatPropertyPrice } from "@/lib/properties/format";
import { listPublicProperties } from "@/lib/properties/public";
import { buildMetadata, SITE_NAME, SITE_URL } from "@/lib/seo";
import {
  belongsToZone,
  getZone,
  isZoneSlug,
  listZoneNames,
  ZONE_SLUGS,
  type ZoneSlug,
} from "@/lib/content/zones";

export const revalidate = 300;

type PageProps = { params: Promise<{ locale: string; zona: string }> };

export function generateStaticParams() {
  return SUPPORTED_LOCALES.flatMap((locale) =>
    ZONE_SLUGS.map((zona) => ({ locale, zona })),
  );
}

function resolveParams(locale: string, zona: string) {
  if (!isZoneSlug(zona)) notFound();
  const supportedLocale = toSupportedLocale(locale);
  return {
    locale: supportedLocale,
    slug: zona as ZoneSlug,
    content: getZone(zona).content[supportedLocale],
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale: routeLocale, zona } = await params;
  const { locale, slug, content } = resolveParams(routeLocale, zona);

  return buildMetadata({
    title: `${content.metaTitle} | ${SITE_NAME}`,
    description: content.metaDescription,
    pathname: `/invertir-en/${slug}`,
    locale,
    image: "/images/og-home.jpg",
    keywords: [content.eyebrow, `${content.name} Paraguay`, "inversión inmobiliaria"],
  });
}

export default async function ZoneLandingPage({ params }: PageProps) {
  const { locale: routeLocale, zona } = await params;
  setRequestLocale(routeLocale);
  const { locale, slug, content } = resolveParams(routeLocale, zona);
  const t = await getTranslations("site.zone");

  const properties = (await listPublicProperties()).filter((property) =>
    belongsToZone(property.city, slug),
  );
  const usdPrices = properties
    .filter((property) => property.currency === "USD" && property.price)
    .map((property) => property.price as number);
  const fromPrice = usdPrices.length
    ? formatPropertyPrice(Math.min(...usdPrices), "USD", locale)
    : null;
  const otherZones = listZoneNames(locale).filter((zone) => zone.slug !== slug);
  const sources = Array.from(
    new Map(content.facts.map((fact) => [fact.source.url, fact.source])).values(),
  );
  const url = `${SITE_URL}/${locale}/invertir-en/${slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: SITE_NAME, item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: content.eyebrow, item: url },
    ],
  };

  return (
    <>
      <StructuredData data={jsonLd} />

      <section className="bg-[linear-gradient(135deg,var(--carbon)_0%,var(--onyx)_100%)] px-4 py-16 text-(--ivory) md:px-6 md:py-24">
        <div className="mx-auto max-w-7xl">
          <p className="text-[12px] font-semibold uppercase tracking-[0.15em] text-(--gold)">
            {content.eyebrow}
          </p>
          <h1 className="mt-4 max-w-4xl font-cormorant text-[36px] font-normal leading-[1.1] md:text-[56px]">
            {content.title}
          </h1>
          <p className="mt-6 max-w-3xl text-[17px] leading-8 text-[rgba(250,250,248,0.8)]">
            {content.lead}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={buildWhatsAppMessageHref(content.whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xs bg-(--gold) px-7 py-3.5 text-[13px] font-semibold uppercase tracking-[0.06em] text-(--carbon) transition-colors hover:bg-(--ivory)"
              data-analytics-label={`zone_whatsapp_${slug}`}
              data-analytics-location="zone_hero"
            >
              <FaWhatsapp size={17} aria-hidden="true" />
              {t("whatsapp", { zone: content.name })}
            </a>
            <a
              href="#guia"
              className="inline-flex items-center justify-center gap-2 rounded-xs border border-(--ivory) px-7 py-3.5 text-[13px] font-semibold uppercase tracking-[0.06em] text-(--ivory) transition-colors hover:bg-[rgba(255,255,255,0.12)]"
              data-analytics-event="cta_click"
              data-analytics-category="lead_magnet"
              data-analytics-label="guide_anchor"
              data-analytics-location="zone_hero"
            >
              <Download size={16} strokeWidth={1.8} aria-hidden="true" />
              {t("guideLink")}
            </a>
            {fromPrice ? (
              <p className="text-[14px] text-[rgba(250,250,248,0.75)] sm:ml-3">
                {t("fromPrice", { price: fromPrice })}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="bg-(--ivory) px-4 py-14 md:px-6 md:py-20" aria-labelledby="datos">
        <div className="mx-auto max-w-7xl">
          <h2 id="datos" className="text-[12px] font-semibold uppercase tracking-[0.15em] text-(--gold)">
            {t("factsTitle")}
          </h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {content.facts.map((fact) => (
              <article key={fact.label}>
                <p className="font-cormorant text-[44px] leading-none text-primary">
                  {fact.value}
                </p>
                <p className="mt-3 text-[14px] leading-6 text-secondary">{fact.label}</p>
                <a
                  href={fact.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-[12px] text-muted underline decoration-(--line) underline-offset-4 hover:text-(--gold)"
                >
                  {t("sourceLabel")}: {fact.source.label}
                </a>
              </article>
            ))}
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-(--line) bg-(--stone) p-6 md:p-8">
              <h2 className="font-cormorant text-[28px] text-primary">{content.profileTitle}</h2>
              <ul className="mt-5 space-y-3">
                {content.profile.map((item) => (
                  <li key={item} className="flex gap-3 text-[15px] leading-7 text-secondary">
                    <Check size={18} strokeWidth={2} className="mt-1 shrink-0 text-(--gold)" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-(--line) p-6 md:p-8">
              <h2 className="font-cormorant text-[28px] text-primary">{content.watchTitle}</h2>
              <ul className="mt-5 space-y-3">
                {content.watch.map((item) => (
                  <li key={item} className="flex gap-3 text-[15px] leading-7 text-secondary">
                    <TriangleAlert size={18} strokeWidth={1.8} className="mt-1 shrink-0 text-(--gold)" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-(--ivory) px-4 pb-16 md:px-6 md:pb-24" aria-labelledby="propiedades">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <h2 id="propiedades" className="font-cormorant text-[30px] font-normal text-primary md:text-[40px]">
              {t("propertiesTitle", { zone: content.name })}
            </h2>
            {properties.length ? (
              <p className="text-[13px] font-medium text-muted">
                {t("count", { count: properties.length })}
              </p>
            ) : null}
          </div>

          {properties.length ? (
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {properties.map((property, index) => (
                <PropertyCard key={property.slug} property={property} priority={index === 0} />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-lg border border-(--line) bg-(--stone) px-6 py-10 text-center">
              <p className="font-cormorant text-[26px] text-primary">
                {t("emptyTitle", { zone: content.name })}
              </p>
              <p className="mx-auto mt-3 max-w-xl text-[15px] leading-7 text-secondary">
                {t("emptyText")}
              </p>
              <a
                href={buildWhatsAppMessageHref(t("emptyWhatsappMessage", { zone: content.name }))}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-xs bg-(--carbon) px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-(--ivory) transition-colors hover:bg-(--gold) hover:text-(--carbon)"
                data-analytics-label={`zone_empty_${slug}`}
                data-analytics-location="zone_empty"
              >
                <FaWhatsapp size={16} aria-hidden="true" />
                {t("emptyCta")}
              </a>
            </div>
          )}

          <Link
            href="/bienes-raices"
            className="mt-8 inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.08em] text-primary transition-colors hover:text-(--gold)"
          >
            {t("allProperties")}
            <ArrowRight size={16} strokeWidth={1.8} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <GuideLeadMagnet location="zone" />

      <section className="bg-(--ivory) px-4 py-12 md:px-6">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">
              {t("otherZones")}
            </h2>
            <ul className="mt-3 flex flex-wrap gap-3">
              {otherZones.map((zone) => (
                <li key={zone.slug}>
                  <Link
                    href={`/invertir-en/${zone.slug}`}
                    className="inline-flex rounded-full border border-(--line) px-4 py-2 text-[13px] text-primary transition-colors hover:border-(--gold) hover:text-(--gold)"
                  >
                    {zone.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">
              {t("sourcesTitle")}
            </h2>
            <ul className="mt-3 space-y-1.5 text-[13px]">
              {sources.map((source) => (
                <li key={source.url}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary underline decoration-(--line) underline-offset-4 hover:text-(--gold)"
                  >
                    {source.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[12px] italic text-muted">{t("disclaimer")}</p>
          </div>
        </div>
      </section>
    </>
  );
}
