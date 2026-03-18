import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { contactPageContent, resolveLocale } from "@/lib/content/public-pages";
import {
  InfoCards,
  InfoPageIntro,
  InfoSection,
} from "@/components/landing/InfoPage";
import { LeadCaptureForm } from "@/components/leads/LeadCaptureForm";
import { Link } from "@/i18n/navigation";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale: routeLocale } = await params;
  const locale = resolveLocale(routeLocale);
  const c = contactPageContent[locale];

  return buildMetadata({
    title: `${c.title} | Investments Paraguay`,
    description: c.description,
    pathname: "/contacto",
    locale,
    keywords: [
      "contact investments paraguay",
      "whatsapp investments paraguay",
      "real estate contact paraguay",
    ],
  });
}

export default async function ContactPage({ params }: PageProps) {
  const { locale: routeLocale } = await params;
  const locale = resolveLocale(routeLocale);
  const c = contactPageContent[locale];

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
              {c.asideLines?.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </>
        }
      />
      <section className="px-4 py-4 md:py-5">
        <div className="container-page grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.9fr)]">
          <div className="grid gap-4">
            {c.channels.map((channel) => (
              <div
                key={channel.label}
                className="surface-card rounded-3xl p-5 md:p-6"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-accent1">
                  {channel.label}
                </p>
                {channel.href ? (
                  <Link
                    href={channel.href}
                    target="_blank"
                    className="mt-3 block text-xl font-semibold text-primary"
                  >
                    {channel.value}
                  </Link>
                ) : (
                  <p className="mt-3 text-xl font-semibold text-primary">
                    {channel.value}
                  </p>
                )}
                <p className="mt-3 text-sm leading-7 text-secondary">
                  {channel.description}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-[1.75rem] border border-soft bg-[linear-gradient(180deg,#fffdf9_0%,#f5ede1_100%)] p-6 shadow-[0_18px_48px_rgba(15,23,38,0.1)] md:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-accent1">
              {c.formTitle}
            </p>
            <p className="mt-4 text-sm leading-7 text-secondary">
              {c.formDescription}
            </p>
            <div className="mt-6">
              <LeadCaptureForm
                compact
                sourcePage="/contacto"
                labels={c.formLabels}
              />
            </div>
          </div>
        </div>
      </section>
      {c.cards ? <InfoCards items={c.cards} /> : null}
      {c.sections.map((section) => (
        <InfoSection key={section.title} title={section.title}>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </InfoSection>
      ))}
    </>
  );
}
