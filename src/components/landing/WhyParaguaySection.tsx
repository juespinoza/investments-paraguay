"use client";

import { Building2, ShieldCheck, TrendingUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { formatLocale } from "@/lib/i18n";

type Stat = {
  id: string;
  prefix?: string;
  value: number;
  suffix?: string;
  label: string;
  description: string;
  animate: boolean;
  format?: "currency" | "integer";
};

// Respaldo si todavía no hay propiedades con precio y ROI cargados.
const FALLBACK_ENTRY_PRICE_USD = 46500;

const VALUE_PROPS = [
  { icon: Building2, key: "curated" },
  { icon: TrendingUp, key: "documented" },
  { icon: ShieldCheck, key: "local" },
] as const;

function formatStatValue(
  value: number,
  format: Stat["format"],
  numberFormat: string,
) {
  if (format === "currency") {
    return new Intl.NumberFormat(numberFormat, {
      maximumFractionDigits: 0,
    }).format(value);
  }

  return String(Math.round(value));
}

function useHasEnteredViewport<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || hasEntered) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setHasEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.28 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [hasEntered]);

  return { ref, hasEntered };
}

// El HTML del servidor siempre trae el valor final (lo que ven Google, las
// vistas previas de WhatsApp y quien navega sin JavaScript). La animación
// desde 0 solo corre en el navegador cuando la sección entra en pantalla.
function AnimatedStatValue({
  stat,
  start,
  numberFormat,
}: {
  stat: Stat;
  start: boolean;
  numberFormat: string;
}) {
  const [value, setValue] = useState(stat.value);

  useEffect(() => {
    if (!stat.animate || !start) {
      setValue(stat.value);
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      setValue(stat.value);
      return;
    }

    let frame = 0;
    const duration = 1200;
    const startedAt = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(stat.value * eased));

      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [start, stat.animate, stat.value]);

  return (
    <>
      {stat.prefix}
      {formatStatValue(value, stat.format, numberFormat)}
      {stat.suffix}
    </>
  );
}

export function WhyParaguaySection({
  entryPriceUsd,
}: {
  entryPriceUsd: number | null;
}) {
  const t = useTranslations("site.market");
  const numberFormat = formatLocale(useLocale());
  const { ref, hasEntered } = useHasEnteredViewport<HTMLElement>();

  const stats: Stat[] = [
    {
      id: "dividends",
      value: 0,
      suffix: t("dividendsSuffix"),
      label: t("dividendsLabel"),
      description: t("dividendsDescription"),
      animate: false,
    },
    {
      id: "entry-price",
      prefix: "USD ",
      value: entryPriceUsd ?? FALLBACK_ENTRY_PRICE_USD,
      label: t("entryLabel"),
      description: t("entryDescription"),
      animate: true,
      format: "currency",
    },
    {
      id: "freedom",
      prefix: t("freedomPrefix"),
      value: 5,
      suffix: t("freedomSuffix"),
      label: t("freedomLabel"),
      description: t("freedomDescription"),
      animate: true,
      format: "integer",
    },
  ];

  return (
    <section ref={ref} className="bg-(--stone) px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-130">
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.15em] text-(--gold)">
            {t("eyebrow")}
          </p>
          <h2 className="font-cormorant text-[28px] font-normal leading-[1.15] text-primary md:text-[40px]">
            {t("title")}
          </h2>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {stats.map((stat) => (
            <article key={stat.id}>
              <p className="font-cormorant text-[48px] font-normal leading-none text-(--gold)">
                <AnimatedStatValue
                  stat={stat}
                  start={hasEntered}
                  numberFormat={numberFormat}
                />
              </p>
              <p className="mt-4 text-[14px] font-medium leading-6 text-muted">
                {stat.label}
              </p>
              <p className="mt-2 line-clamp-2 max-w-sm text-[13px] leading-5 text-muted">
                {stat.description}
              </p>
            </article>
          ))}
        </div>

        <div className="my-12 h-px bg-(--line) md:my-14" />

        <div className="grid gap-8 md:grid-cols-3">
          {VALUE_PROPS.map((item) => {
            const Icon = item.icon;

            return (
              <article key={item.key} className="max-w-sm">
                <Icon
                  size={24}
                  strokeWidth={1.7}
                  className="text-(--gold)"
                  aria-hidden="true"
                />
                <h3 className="mt-5 text-[15px] font-medium text-primary">
                  {t(`valueProps.${item.key}.title`)}
                </h3>
                <p className="mt-2 line-clamp-2 text-[13px] leading-5 text-muted">
                  {t(`valueProps.${item.key}.description`)}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
