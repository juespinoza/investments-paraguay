"use client";

import { Building2, ShieldCheck, TrendingUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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

const STATS: Stat[] = [
  {
    id: "dividends",
    value: 0,
    suffix: "% impuesto a dividendos",
    label: "para no residentes en fuente extranjera",
    description: "Estructura fiscal competitiva para capital internacional.",
    animate: false,
  },
  {
    id: "entry-price",
    prefix: "USD ",
    value: 43000,
    label: "desde este precio en proyectos de renta con 8% ROI anual estimado",
    description: "Ticket de entrada competitivo para renta dolarizada.",
    animate: true,
    format: "currency",
  },
  {
    id: "freedom",
    prefix: "Top ",
    value: 5,
    suffix: " LATAM",
    label: "en libertad económica según Index of Economic Freedom 2024",
    description: "Marco macroeconómico atractivo frente a la región.",
    animate: true,
    format: "integer",
  },
];

const VALUE_PROPS = [
  {
    icon: Building2,
    title: "Propiedades exclusivas",
    description:
      "Solo incluimos proyectos con tesis de inversión clara y documentación en orden.",
  },
  {
    icon: TrendingUp,
    title: "Rentabilidad documentada",
    description:
      "Cada oportunidad incluye proyección de ROI, análisis de zona y comparables.",
  },
  {
    icon: ShieldCheck,
    title: "Acompañamiento local",
    description:
      "Desde la consulta hasta la escritura, con asesoría en el idioma del inversor.",
  },
];

function formatStatValue(value: number, format: Stat["format"]) {
  if (format === "currency") {
    return new Intl.NumberFormat("es-PY", {
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

function AnimatedStatValue({ stat, start }: { stat: Stat; start: boolean }) {
  const [value, setValue] = useState(stat.animate ? 0 : stat.value);

  useEffect(() => {
    if (!stat.animate) {
      setValue(stat.value);
      return;
    }

    if (!start) {
      setValue(0);
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
  }, [start, stat]);

  return (
    <>
      {stat.prefix}
      {formatStatValue(value, stat.format)}
      {stat.suffix}
    </>
  );
}

export function WhyParaguaySection() {
  const { ref, hasEntered } = useHasEnteredViewport<HTMLElement>();

  return (
    <section
      ref={ref}
      className="bg-[var(--stone)] px-4 py-16 md:px-6 md:py-24"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="max-w-[520px]">
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.15em] text-[var(--gold)]">
            El mercado
          </p>
          <h2 className="font-cormorant text-[28px] font-normal leading-[1.15] text-primary md:text-[40px]">
            Paraguay: el mercado que los inversores regionales ya descubrieron.
          </h2>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {STATS.map((stat) => (
            <article key={stat.id}>
              <p className="font-cormorant text-[48px] font-normal leading-none text-[var(--gold)]">
                <AnimatedStatValue stat={stat} start={hasEntered} />
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

        <div className="my-12 h-px bg-[var(--line)] md:my-14" />

        <div className="grid gap-8 md:grid-cols-3">
          {VALUE_PROPS.map((item) => {
            const Icon = item.icon;

            return (
              <article key={item.title} className="max-w-sm">
                <Icon
                  size={24}
                  strokeWidth={1.7}
                  className="text-[var(--gold)]"
                  aria-hidden="true"
                />
                <h3 className="mt-5 text-[15px] font-medium text-primary">
                  {item.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-[13px] leading-5 text-muted">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
