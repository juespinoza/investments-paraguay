import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { Link } from "@/i18n/navigation";

type Props = {
  backgroundImageUrl: string;
  brandLeft?: string;
  brandRight?: string;
  menuActive?: string;
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  logoLeftUrl?: string;
};

const WHATSAPP_URL = "https://wa.me/595985444801";
const ASUNCION_HERO_IMAGES = {
  sm: "/backgrounds/asuncion-hero-768.webp",
  md: "/backgrounds/asuncion-hero-1280.webp",
  lg: "/backgrounds/asuncion-hero-1672.webp",
} as const;

function isInternalPath(href: string) {
  return href.startsWith("/") && !href.startsWith("//");
}

function PrimaryCta({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const className =
    "inline-flex items-center justify-center rounded-[2px] bg-[var(--gold)] px-8 py-3.5 text-[13px] font-medium uppercase tracking-[0.06em] text-[var(--carbon)] transition-colors duration-150 hover:bg-[var(--ivory)]";

  if (isInternalPath(href)) {
    return (
      <Link
        href={href}
        className={className}
        data-analytics-event="cta_click"
        data-analytics-category="hero"
        data-analytics-label="primary"
        data-analytics-location="hero"
      >
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      className={className}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      data-analytics-event="cta_click"
      data-analytics-category="hero"
      data-analytics-label="primary"
      data-analytics-location="hero"
    >
      {children}
    </a>
  );
}

export function HeroSplit({
  backgroundImageUrl,
  brandLeft,
  brandRight,
  title,
  subtitle,
  ctaLabel,
  ctaHref,
}: Props) {
  const eyebrow =
    brandLeft || brandRight
      ? [brandLeft, brandRight].filter(Boolean).join(" ")
      : "Inversión en Paraguay";
  const headline =
    title ??
    "Vivir, crecer e invertir donde el mercado aún tiene margen real.";
  const subheadline =
    subtitle ??
    "Selección exclusiva de propiedades e inversiones en Paraguay, con acompañamiento estratégico local.";
  const primaryHref = ctaHref ?? "/bienes-raices";
  const primaryLabel = ctaLabel ?? "Ver propiedades";
  const useAsuncionSources = backgroundImageUrl === ASUNCION_HERO_IMAGES.lg;

  return (
    <section className="relative flex min-h-[85vh] overflow-hidden md:min-h-[92vh]">
      <picture className="absolute inset-0">
        {useAsuncionSources ? (
          <>
            <source
              media="(max-width: 767px)"
              srcSet={ASUNCION_HERO_IMAGES.sm}
              type="image/webp"
            />
            <source
              media="(max-width: 1279px)"
              srcSet={ASUNCION_HERO_IMAGES.md}
              type="image/webp"
            />
            <source srcSet={ASUNCION_HERO_IMAGES.lg} type="image/webp" />
          </>
        ) : null}
        <Image
          src={backgroundImageUrl}
          alt=""
          fill
          priority
          unoptimized={useAsuncionSources}
          sizes="100vw"
          className="hero-background-placeholder object-cover"
        />
      </picture>
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.45)_0%,rgba(0,0,0,0.65)_100%)]" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1280px] items-center px-4 py-24 md:px-6">
        <div className="mx-auto max-w-[680px] text-center">
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.15em] text-[var(--gold)]">
            {eyebrow}
          </p>

          <h1 className="mb-6 font-cormorant text-[36px] font-normal leading-[1.15] text-[var(--ivory)] md:text-[56px]">
            {headline}
          </h1>

          <p className="mx-auto mb-10 max-w-[620px] text-[18px] leading-8 text-[var(--ivory)] opacity-80">
            {subheadline}
          </p>

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <PrimaryCta href={primaryHref}>{primaryLabel}</PrimaryCta>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-[2px] border border-[var(--ivory)] bg-transparent px-8 py-3.5 text-[13px] font-medium uppercase tracking-[0.06em] text-[var(--ivory)] transition-colors duration-150 hover:bg-[rgba(255,255,255,0.12)]"
              data-analytics-event="cta_click"
              data-analytics-category="hero"
              data-analytics-label="advisor"
              data-analytics-location="hero"
            >
              Hablar con un asesor
            </a>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-[var(--ivory)] opacity-60">
        <ChevronDown
          size={28}
          strokeWidth={1.5}
          className="animate-hero-scroll-bounce"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
