import { getTranslations } from "next-intl/server";
import { BarChart3, Calculator, MapPinned, ShieldAlert, Store } from "lucide-react";
import { formatLocale } from "@/lib/i18n";
import { formatPropertyPrice } from "@/lib/properties/format";
import type { PublicStrategy } from "@/lib/properties/strategy";
import { RichPropertyText } from "@/components/landing/property-detail/RichPropertyText";
import { StrategyWaitlist } from "@/components/landing/property-detail/StrategyWaitlist";

type Props = {
  strategy: PublicStrategy | null;
  price: number | null;
  currency: "GS" | "USD";
  locale: string;
  propertySlug: string;
  // Idioma del texto de la estrategia (puede quedar en español si todavía
  // no hay traducción).
  contentLang: string;
};

function SectionTitle({
  icon: Icon,
  children,
}: {
  icon: typeof BarChart3;
  children: React.ReactNode;
}) {
  return (
    <h3 className="flex items-center gap-2 font-cormorant text-[24px] font-normal text-primary">
      <Icon size={18} strokeWidth={1.8} className="text-(--gold)" aria-hidden="true" />
      {children}
    </h3>
  );
}

function Metric({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string | null;
}) {
  return (
    <div className="rounded-xs border border-(--line) bg-white px-4 py-3">
      <dt className="text-[12px] font-medium uppercase tracking-[0.06em] text-muted">
        {label}
      </dt>
      <dd className="mt-1 text-[22px] font-medium leading-tight text-primary">
        {value}
      </dd>
      {note ? <dd className="mt-1 text-[12px] leading-5 text-secondary">{note}</dd> : null}
    </div>
  );
}

export async function InvestmentAnalysis({
  strategy,
  price,
  currency,
  locale,
  propertySlug,
  contentLang,
}: Props) {
  const t = await getTranslations({ locale, namespace: "site.strategy" });

  if (!strategy || strategy.status !== "READY") {
    return (
      <section
        id="analisis-inversion"
        className="rounded-xs border border-(--line) bg-(--stone) p-5 md:p-6"
      >
        <p className="text-[12px] font-semibold uppercase tracking-[0.15em] text-(--gold)">
          {t("pendingEyebrow")}
        </p>
        <h2 className="mt-2 font-cormorant text-[28px] font-normal leading-tight text-primary">
          {t("pendingTitle")}
        </h2>
        <p className="mt-3 text-[15px] leading-7 text-secondary">{t("pendingText")}</p>
        <div className="mt-5">
          <StrategyWaitlist propertySlug={propertySlug} />
        </div>
      </section>
    );
  }

  const numberFormat = formatLocale(locale);
  const money = (value: number | null) => formatPropertyPrice(value, currency, locale);
  const percent = (value: number | null) =>
    value === null
      ? null
      : `${value.toLocaleString(numberFormat, { maximumFractionDigits: 1 })} %`;
  const { metrics } = strategy;

  const zoneNote =
    metrics.zoneDiffPct === null
      ? null
      : Math.abs(metrics.zoneDiffPct) < 1
        ? t("zoneEqual")
        : metrics.zoneDiffPct < 0
          ? t("zoneCheaper", { pct: Math.abs(metrics.zoneDiffPct).toLocaleString(numberFormat) })
          : t("zonePricier", { pct: metrics.zoneDiffPct.toLocaleString(numberFormat) });

  const metricItems = [
    strategy.monthlyRent !== null
      ? {
          label: t("monthlyRent"),
          value: money(strategy.monthlyRent),
          note: strategy.rentKind === "ACTUAL" ? t("rentActual") : t("rentEstimated"),
        }
      : null,
    metrics.grossYieldPct !== null
      ? { label: t("grossYield"), value: percent(metrics.grossYieldPct), note: t("perYear") }
      : null,
    metrics.netYieldPct !== null
      ? { label: t("netYield"), value: percent(metrics.netYieldPct), note: t("perYear") }
      : null,
    metrics.paybackYears !== null
      ? {
          label: t("payback"),
          value: t("paybackValue", {
            years: metrics.paybackYears.toLocaleString(numberFormat),
          }),
        }
      : null,
    metrics.pricePerM2 !== null
      ? { label: t("pricePerM2"), value: money(metrics.pricePerM2), note: zoneNote }
      : null,
    metrics.totalInvestment !== null && metrics.totalInvestment !== price
      ? { label: t("totalInvestment"), value: money(metrics.totalInvestment) }
      : null,
  ].filter((item): item is { label: string; value: string; note?: string | null } =>
    Boolean(item?.value),
  );

  const assumptions = [
    [t("assumptionRent"), money(strategy.monthlyRent)],
    [t("assumptionOccupancy"), percent(strategy.occupancyPct ?? 100)],
    [t("assumptionManagement"), percent(strategy.managementFeePct)],
    [t("assumptionExpenses"), money(strategy.monthlyExpenses)],
    [t("assumptionTaxes"), money(strategy.annualTaxes)],
    [t("assumptionAcquisition"), percent(strategy.acquisitionCostsPct)],
  ].filter((row): row is [string, string] => Boolean(row[1]));

  return (
    <section id="analisis-inversion" className="rounded-xs border border-(--line) bg-(--stone) p-5 md:p-6">
      <p className="text-[12px] font-semibold uppercase tracking-[0.15em] text-(--gold)">
        {t("eyebrow")}
        {strategy.rentStrategy ? ` · ${t(`strategy.${strategy.rentStrategy}`)}` : ""}
      </p>
      <h2 className="mt-2 font-cormorant text-[30px] font-normal leading-tight text-primary">
        {t("title")}
      </h2>
      {strategy.summary ? (
        <p lang={contentLang} className="mt-3 text-[16px] leading-7 text-primary">
          {strategy.summary}
        </p>
      ) : null}

      {metricItems.length ? (
        <dl className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3">
          {metricItems.map((item) => (
            <Metric key={item.label} {...item} />
          ))}
        </dl>
      ) : null}

      <div className="mt-8 space-y-8">
        <div>
          <SectionTitle icon={Calculator}>{t("howTitle")}</SectionTitle>
          <p className="mt-2 text-[14px] leading-6 text-secondary">{t("howIntro")}</p>
          {assumptions.length ? (
            <table className="mt-4 w-full text-[14px]">
              <tbody>
                {assumptions.map(([label, value]) => (
                  <tr key={label} className="border-b border-(--line) last:border-0">
                    <th scope="row" className="py-2 pr-4 text-left font-normal text-secondary">
                      {label}
                    </th>
                    <td className="py-2 text-right font-medium text-primary">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
          <ul className="mt-4 space-y-1 text-[13px] leading-6 text-muted">
            <li>{t("formulaGross")}</li>
            <li>{t("formulaNet")}</li>
            <li>{t("formulaPayback")}</li>
          </ul>
          {strategy.methodology ? (
            <div lang={contentLang} className="mt-4 text-[14px] leading-7 text-secondary">
              <RichPropertyText value={strategy.methodology} />
            </div>
          ) : null}
        </div>

        {strategy.zonePricePerM2 !== null || strategy.comparables.length ? (
          <div>
            <SectionTitle icon={BarChart3}>{t("marketTitle")}</SectionTitle>
            {strategy.zonePricePerM2 !== null ? (
              <p className="mt-3 text-[15px] leading-7 text-secondary">
                {t("zoneAverage")}: <strong className="text-primary">{money(strategy.zonePricePerM2)} / m²</strong>
                {zoneNote ? ` · ${zoneNote}` : ""}
              </p>
            ) : null}
            {strategy.zonePriceSource ? (
              <p className="mt-1 text-[12px] text-muted">
                {t("source", { source: strategy.zonePriceSource })}
              </p>
            ) : null}
            {strategy.comparables.length ? (
              <div className="mt-4 overflow-x-auto">
                <p className="text-[13px] font-medium text-primary">{t("comparablesTitle")}</p>
                <table className="mt-2 w-full min-w-105 text-[14px]">
                  <thead>
                    <tr className="border-b border-(--line) text-left text-[12px] uppercase tracking-[0.05em] text-muted">
                      <th className="py-2 pr-3 font-medium"></th>
                      <th className="py-2 pr-3 text-right font-medium">{t("comparableArea")}</th>
                      <th className="py-2 pr-3 text-right font-medium">{t("comparablePrice")}</th>
                      <th className="py-2 text-right font-medium">{t("comparablePerM2")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {strategy.comparables.map((item) => (
                      <tr key={`${item.title}-${item.price}`} className="border-b border-(--line) last:border-0">
                        <td className="py-2 pr-3 text-primary">
                          {item.url ? (
                            <a href={item.url} target="_blank" rel="noopener nofollow" className="underline-offset-2 hover:underline">
                              {item.title}
                            </a>
                          ) : (
                            item.title
                          )}
                        </td>
                        <td className="py-2 pr-3 text-right text-secondary">
                          {item.areaM2 ? `${item.areaM2.toLocaleString(numberFormat)} m²` : "—"}
                        </td>
                        <td className="py-2 pr-3 text-right text-secondary">{money(item.price)}</td>
                        <td className="py-2 text-right text-secondary">
                          {item.areaM2 ? money(Math.round(item.price / item.areaM2)) : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </div>
        ) : null}

        {strategy.businessOptions.length ? (
          <div>
            <SectionTitle icon={Store}>{t("businessTitle")}</SectionTitle>
            <ul className="mt-4 grid gap-3 md:grid-cols-2">
              {strategy.businessOptions.map((option) => (
                <li key={option.title} lang={contentLang} className="rounded-xs border border-(--line) bg-white p-4">
                  <p className="text-[15px] font-medium text-primary">{option.title}</p>
                  <p className="mt-1 text-[14px] leading-6 text-secondary">{option.description}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {strategy.zoneSummary ? (
          <div>
            <SectionTitle icon={MapPinned}>{t("zoneTitle")}</SectionTitle>
            <div lang={contentLang} className="mt-3 text-[15px] leading-7 text-secondary">
              <RichPropertyText value={strategy.zoneSummary} />
            </div>
          </div>
        ) : null}

        {strategy.risks ? (
          <div>
            <SectionTitle icon={ShieldAlert}>{t("risksTitle")}</SectionTitle>
            <div lang={contentLang} className="mt-3 text-[15px] leading-7 text-secondary">
              <RichPropertyText value={strategy.risks} />
            </div>
          </div>
        ) : null}
      </div>

      <p className="mt-8 text-[12px] leading-5 text-muted">
        {t("disclaimer")}{" "}
        {t("updated", {
          date: new Date(strategy.updatedAt).toLocaleDateString(numberFormat, {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
        })}
      </p>
    </section>
  );
}
