import { SectionTitle } from "@/components/landing/SectionTitle";
import { Button } from "@/components/ui/Button";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  return buildMetadata({
    title: "Guía para inversores | Investments Paraguay",
    description:
      "Solicita una guía gratuita para evaluar oportunidades de inversión en Paraguay.",
    pathname: `/bienes-raices/asesores/${slug}/lead-magnet`,
    locale: "es",
    noIndex: true,
  });
}

export default function LeadMagnetPage() {
  return (
    <div className="container-page py-6">
      <SectionTitle
        title="Guía gratuita para inversores"
        subtitle="Dejá tu WhatsApp o correo y te la envío."
      />

      <div className="mt-10 max-w-xl rounded-sm border bg-white p-6">
        <form className="grid gap-4">
          <input className="h-11 rounded-sm border px-3" placeholder="Nombre" />
          <input className="h-11 rounded-sm border px-3" placeholder="Email" />
          <input
            className="h-11 rounded-sm border px-3"
            placeholder="WhatsApp"
          />
          <Button>Recibir guía</Button>
        </form>
      </div>
    </div>
  );
}
