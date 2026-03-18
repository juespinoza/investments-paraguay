import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import {
  aboutPageContent,
  resolveLocale,
} from "@/lib/content/public-pages";
import {
  InfoCards,
  InfoPageIntro,
  InfoSection,
} from "@/components/landing/InfoPage";

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
  const locale = resolveLocale(routeLocale);
  const c = aboutPageContent[locale];

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
