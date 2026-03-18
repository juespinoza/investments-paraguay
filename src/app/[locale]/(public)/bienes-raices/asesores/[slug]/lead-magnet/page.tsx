import { SectionTitle } from "@/components/landing/SectionTitle";
import { LeadCaptureForm } from "@/components/leads/LeadCaptureForm";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { resolveLocale } from "@/lib/content/public-pages";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const resolvedLocale = resolveLocale(locale);

  return buildMetadata({
    title: "Guía para inversores | Investments Paraguay",
    description:
      "Solicita una guía gratuita para evaluar oportunidades de inversión en Paraguay.",
    pathname: `/bienes-raices/asesores/${slug}/lead-magnet`,
    locale: resolvedLocale,
    noIndex: true,
  });
}

export default async function LeadMagnetPage({ params }: PageProps) {
  const { slug } = await params;
  return (
    <div className="container-page py-6">
      <SectionTitle
        title="Guía gratuita para inversores"
        subtitle="Dejá tu WhatsApp o correo y te la envío."
      />

      <div className="mt-10 max-w-xl rounded-sm border bg-white p-6">
        <LeadCaptureForm
          sourcePage={`/bienes-raices/asesores/${slug}/lead-magnet`}
          advisorSlug={slug}
        />
      </div>
    </div>
  );
}
