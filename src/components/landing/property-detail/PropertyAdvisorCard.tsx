import { Button } from "@/components/ui/Button";
import { ImageCloudinary } from "@/components/ui/ImageCloudinary";
import { buildWhatsAppHref } from "@/lib/whatsapp";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function PropertyAdvisorCard({
  advisor,
}: {
  advisor: {
    slug: string;
    fullName: string;
    headline: string | null;
    photoUrl: string | null;
    whatsapp: string | null;
    phone: string | null;
  };
}) {
  return (
    <aside className="surface-card rounded-[1.75rem] p-6">
      <div className="eyebrow">Asesor inmobiliario</div>
      <div className="mt-5 flex items-center gap-4">
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-soft bg-(--stone) text-lg font-semibold text-primary">
          {advisor.photoUrl ? (
            <ImageCloudinary imageUrl={advisor.photoUrl} alt={advisor.fullName} />
          ) : (
            initials(advisor.fullName)
          )}
        </div>
        <div className="min-w-0">
          <h2 className="text-2xl font-semibold leading-tight text-primary">
            {advisor.fullName}
          </h2>
          {advisor.headline ? (
            <p className="mt-1 text-sm leading-6 text-secondary">
              {advisor.headline}
            </p>
          ) : null}
          {advisor.phone ? (
            <a
              href={phoneHref(advisor.phone)}
              className="mt-2 inline-block text-sm font-semibold text-primary transition hover:text-accent1"
            >
              {advisor.phone}
            </a>
          ) : null}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {advisor.whatsapp ? (
          <Button
            href={buildWhatsAppHref(advisor.whatsapp)}
            target="_blank"
            className="w-full"
          >
            Contactar al WhatsApp
          </Button>
        ) : null}
        <Button
          href={`/bienes-raices/asesores/${advisor.slug}`}
          variant="secondary"
          className="w-full"
        >
          Ver perfil completo
        </Button>
      </div>
    </aside>
  );
}
