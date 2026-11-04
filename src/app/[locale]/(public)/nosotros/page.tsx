import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import {
  aboutPageContent,
  resolveLocale,
} from "@/lib/content/public-pages";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MessageCircle } from "lucide-react";
import { InfoCards, InfoPageIntro } from "@/components/landing/InfoPage";
import { ImageCloudinary } from "@/components/ui/ImageCloudinary";
import { GuideLeadMagnet } from "@/components/leads/GuideLeadMagnet";
import { Link } from "@/i18n/navigation";
import { buildWhatsAppHref } from "@/lib/whatsapp";

// Foto de perfil en Cloudinary (la misma que usa la ficha de cada propiedad).
const PROFILE_PHOTO_ID = "julia-espinoza_x2f38t";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale: routeLocale } = await params;
  const locale = resolveLocale(routeLocale);
  const c = aboutPageContent[locale];

  return buildMetadata({
    title: `${c.title} | Investments Paraguay`,
    description: c.description,
    pathname: "/nosotros",
    locale,
    keywords: [
      "about investments paraguay",
      "nosotros investments paraguay",
      "invest paraguay advisors",
    ],
  });
}

export default async function AboutPage({ params }: PageProps) {
  const { locale: routeLocale } = await params;
  setRequestLocale(routeLocale);
  const locale = resolveLocale(routeLocale);
  const c = aboutPageContent[locale];
  const t = await getTranslations("site.about");

  return (
    <>
      <InfoPageIntro
        eyebrow={c.eyebrow}
        title={c.title}
        description={c.description}
        aside={
          <>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-accent1">
              {c.asideTitle}
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-secondary">
              {c.asideLines?.map((line) => <li key={line}>{line}</li>)}
            </ul>
          </>
        }
      />
      <section className="px-4 py-4 md:py-5" aria-labelledby="perfil">
        <div className="container-page">
          <div className="surface-card grid gap-8 rounded-[1.75rem] p-6 md:grid-cols-[240px_minmax(0,1fr)] md:p-10 lg:gap-12">
            <div className="relative mx-auto aspect-4/5 w-full max-w-60 overflow-hidden rounded-lg bg-(--stone)">
              <ImageCloudinary imageUrl={PROFILE_PHOTO_ID} alt={t("photoAlt")} />
            </div>

            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.15em] text-(--gold)">
                {t("eyebrow")}
              </p>
              <h2
                id="perfil"
                className="mt-3 font-cormorant text-[36px] font-normal leading-[1.1] text-primary md:text-[44px]"
              >
                {t("name")}
              </h2>
              <p className="mt-2 text-[14px] font-medium leading-6 text-secondary">
                {t("roles")}
              </p>

              <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-(--line) py-5 sm:max-w-md">
                <div className="flex flex-col-reverse">
                  <dt className="mt-2 text-[13px] leading-5 text-muted">
                    {t("stat1Label")}
                  </dt>
                  <dd className="font-cormorant text-[32px] leading-none text-(--gold)">
                    {t("stat1Value")}
                  </dd>
                </div>
                <div className="flex flex-col-reverse">
                  <dt className="mt-2 text-[13px] leading-5 text-muted">
                    {t("stat2Label")}
                  </dt>
                  <dd className="font-cormorant text-[32px] leading-none text-(--gold)">
                    {t("stat2Value")}
                  </dd>
                </div>
              </dl>

              <div className="mt-6 max-w-2xl space-y-4 text-base leading-8 text-secondary">
                <p>{t("p1")}</p>
                <p>{t("p2")}</p>
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  href={buildWhatsAppHref(undefined, locale)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xs bg-(--gold) px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.06em] text-(--carbon) transition-colors duration-150 hover:bg-(--carbon) hover:text-(--ivory)"
                  data-analytics-label="about_whatsapp"
                  data-analytics-location="about_profile"
                >
                  <MessageCircle size={16} strokeWidth={1.8} aria-hidden="true" />
                  {t("whatsapp")}
                </a>
                <Link
                  href="/bienes-raices"
                  className="inline-flex items-center justify-center rounded-xs border border-(--line) px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.06em] text-primary transition-colors duration-150 hover:border-(--gold) hover:text-(--gold)"
                >
                  {t("properties")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      {c.cards ? <InfoCards items={c.cards} /> : null}
      <div className="mt-8">
        <GuideLeadMagnet location="about" />
      </div>
    </>
  );
}
