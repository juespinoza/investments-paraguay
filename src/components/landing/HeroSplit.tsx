import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type Props = {
  brandLeft: string;
  brandRight: string;
  menuActive?: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  backgroundImageUrl: string;
  logoLeftUrl?: string;
};

export function HeroSplit({
  brandLeft,
  brandRight,
  title,
  subtitle,
  ctaLabel,
  ctaHref,
  backgroundImageUrl,
  logoLeftUrl,
}: Props) {
  const t = useTranslations();

  return (
    <section className="relative overflow-hidden px-4 pb-8 pt-2 md:pb-12">
      <div className="absolute inset-0">
        <div
          className="h-full w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImageUrl})` }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(10,10,10,0.9)_0%,rgba(10,10,10,0.62)_42%,rgba(10,10,10,0.22)_100%)]" />
      </div>

      <div className="container-page relative">
        <div className="section-shell grid min-h-[calc(100vh-8.5rem)] items-end gap-10 border border-[rgba(191,168,130,0.24)] bg-[rgba(10,10,10,0.2)] px-6 py-10 shadow-[0_32px_90px_rgba(10,10,10,0.26)] backdrop-blur-[2px] md:grid-cols-[minmax(0,1.3fr)_minmax(300px,0.7fr)] md:px-10 md:py-14 lg:px-14">
          <div className="max-w-3xl text-[var(--ivory)]">
            {logoLeftUrl ? (
              <div className="mb-6 flex items-center gap-3">
                <Image
                  src={logoLeftUrl}
                  alt="logo"
                  width={120}
                  height={32}
                  className="h-8 w-auto"
                />
              </div>
            ) : null}

            <div className="eyebrow border-[rgba(191,168,130,0.4)] bg-[rgba(10,10,10,0.22)] text-[var(--ivory)]">
              <span>{brandLeft + " "}</span>
              <span className="h-1 w-1 rounded-full bg-[var(--gold)]"> </span>
              <span> {" " + brandRight}</span>
            </div>

            <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-[0.98] tracking-tight md:text-7xl">
              {title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-light leading-8 text-[rgba(250,250,248,0.78)] md:text-xl">
              {subtitle}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                href={ctaHref}
                target="_blank"
                data-analytics-event="cta_click"
                data-analytics-category="hero"
                data-analytics-label="primary_contact"
                data-analytics-location="hero"
              >
                {ctaLabel}
              </Button>
              <Button
                href="/bienes-raices"
                variant="secondary"
                data-analytics-event="cta_click"
                data-analytics-category="hero"
                data-analytics-label="portfolio"
                data-analytics-location="hero"
              >
                {t("heroPortfolioCta")}
              </Button>
            </div>

            <div className="mt-10 grid gap-3 text-sm text-[rgba(250,250,248,0.78)] md:max-w-2xl md:grid-cols-3">
              {[
                t("heroFocusItems.advisory"),
                t("heroFocusItems.realEstate"),
                t("heroFocusItems.business"),
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-[rgba(191,168,130,0.22)] bg-[rgba(250,250,248,0.1)] px-4 py-4 backdrop-blur-sm"
                >
                  <div className="mb-3 h-px w-12 bg-[var(--gold)]" />
                  <p className="text-[11px] uppercase tracking-[0.26em] text-[rgba(250,250,248,0.55)]">
                    {t("heroFocusLabel")}
                  </p>
                  <p className="mt-2 text-base font-medium text-[var(--ivory)]">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="md:ml-auto w-full max-w-md mx-auto">
            <div className="rounded-[2rem] border border-[rgba(191,168,130,0.24)] bg-[rgba(10,10,10,0.42)] p-6 text-[var(--ivory)] shadow-[0_18px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl md:p-8">
              <p className="text-[11px] uppercase tracking-[0.32em] text-[rgba(250,250,248,0.58)]">
                {t("heroPanel.eyebrow")}
              </p>
              <div className="mt-5 space-y-5">
                <div className="border-b border-[rgba(191,168,130,0.16)] pb-4">
                  <p className="text-sm text-[rgba(250,250,248,0.58)]">
                    {t("heroPanel.item1.label")}
                  </p>
                  <p className="mt-2 text-2xl font-semibold">
                    {t("heroPanel.item1.value")}
                  </p>
                </div>
                <div className="border-b border-[rgba(191,168,130,0.16)] pb-4">
                  <p className="text-sm text-[rgba(250,250,248,0.58)]">
                    {t("heroPanel.item2.label")}
                  </p>
                  <p className="mt-2 text-2xl font-semibold">
                    {t("heroPanel.item2.value")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[rgba(250,250,248,0.58)]">
                    {t("heroPanel.item3.label")}
                  </p>
                  <p className="mt-2 text-2xl font-semibold">
                    {t("heroPanel.item3.value")}
                  </p>
                </div>
              </div>

              <Link
                href="/blog"
                className="mt-8 inline-flex text-sm font-medium uppercase tracking-[0.18em] text-[var(--gold)]"
                data-analytics-event="cta_click"
                data-analytics-category="hero"
                data-analytics-label="blog_panel"
                data-analytics-location="hero_panel"
              >
                {t("heroPanel.link")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
