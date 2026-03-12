import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useTranslations } from "next-intl";

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
        <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(15,23,38,0.88)_0%,rgba(15,23,38,0.58)_42%,rgba(15,23,38,0.18)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(201,164,92,0.24),transparent_28%)]" />
      </div>

      <div className="container-page relative">
        <div className="section-shell grid min-h-[calc(100vh-8.5rem)] items-end gap-10 border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,38,0.28),rgba(15,23,38,0.12))] px-6 py-10 shadow-[0_32px_90px_rgba(15,23,38,0.26)] backdrop-blur-[2px] md:grid-cols-[minmax(0,1.3fr)_minmax(300px,0.7fr)] md:px-10 md:py-14 lg:px-14">
          <div className="max-w-3xl text-white">
            {logoLeftUrl ? (
              <div className="mb-6 flex items-center gap-3">
                <img src={logoLeftUrl} alt="logo" className="h-8 w-auto" />
              </div>
            ) : null}

            <div className="eyebrow border-white/20 text-white">
              <span>{brandLeft + " "}</span>
              <span className="h-1 w-1 rounded-full bg-(--ip-accent1)"> </span>
              <span> {" " + brandRight}</span>
            </div>

            <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-[0.98] tracking-tight md:text-7xl">
              {title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-light leading-8 text-white/78 md:text-xl">
              {subtitle}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href={ctaHref} target="_blank">
                {ctaLabel}
              </Button>
              <Button href="/bienes-raices" variant="secondary">
                {t("heroPortfolioCta")}
              </Button>
            </div>

            <div className="mt-10 grid gap-3 text-sm text-white/78 md:max-w-2xl md:grid-cols-3">
              {[
                t("heroFocusItems.advisory"),
                t("heroFocusItems.realEstate"),
                t("heroFocusItems.business"),
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/12 bg-white/10 px-4 py-4 backdrop-blur-sm"
                >
                  <div className="mb-3 h-px w-12 bg-[var(--ip-accent1)]" />
                  <p className="text-[11px] uppercase tracking-[0.26em] text-white/55">
                    {t("heroFocusLabel")}
                  </p>
                  <p className="mt-2 text-base font-medium text-white">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="md:ml-auto w-full max-w-md mx-auto">
            <div className="rounded-[2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.16),rgba(255,255,255,0.08))] p-6 text-white shadow-[0_18px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl md:p-8">
              <p className="text-[11px] uppercase tracking-[0.32em] text-white/58">
                {t("heroPanel.eyebrow")}
              </p>
              <div className="mt-5 space-y-5">
                <div className="border-b border-white/10 pb-4">
                  <p className="text-sm text-white/58">
                    {t("heroPanel.item1.label")}
                  </p>
                  <p className="mt-2 text-2xl font-semibold">
                    {t("heroPanel.item1.value")}
                  </p>
                </div>
                <div className="border-b border-white/10 pb-4">
                  <p className="text-sm text-white/58">
                    {t("heroPanel.item2.label")}
                  </p>
                  <p className="mt-2 text-2xl font-semibold">
                    {t("heroPanel.item2.value")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-white/58">
                    {t("heroPanel.item3.label")}
                  </p>
                  <p className="mt-2 text-2xl font-semibold">
                    {t("heroPanel.item3.value")}
                  </p>
                </div>
              </div>

              <Link
                href="/blog"
                className="mt-8 inline-flex text-sm font-medium uppercase tracking-[0.18em] text-[var(--ip-accent1)]"
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
