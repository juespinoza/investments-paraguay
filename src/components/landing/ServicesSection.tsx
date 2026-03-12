import { Button } from "@/components/ui/Button";
import { SectionTitle } from "./SectionTitle";
import { ImageCloudinary } from "../ui/ImageCloudinary";

export function ServicesSection({
  rightImageUrl,
  rightImageAlt,
  eyebrow,
  title,
  paragraphs,
  ctaLabel,
  ctaHref,
}: {
  rightImageUrl: string;
  rightImageAlt: string;
  eyebrow: string;
  title: string;
  paragraphs: string[];
  ctaLabel: string;
  ctaHref: string;
}) {
  return (
    <section className="px-4 py-8 md:py-10">
      <div className="container-page">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div className="order-2 surface-card rounded-[2rem] p-6 md:order-1 md:p-8">
            <div className="eyebrow">{eyebrow}</div>
            <div className="mt-5">
              <SectionTitle title={title} subtitle="" align="left" />
            </div>
            <div className="mt-6 space-y-4 text-base font-light leading-8 text-secondary">
              {paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            <div className="mt-8">
              <Button href={ctaHref} variant="primary">
                {ctaLabel}
              </Button>
            </div>
          </div>

          <div className="surface-card relative order-1 aspect-[4/3] overflow-hidden rounded-[2rem] md:order-2">
            <ImageCloudinary imageUrl={rightImageUrl} alt={rightImageAlt} />
          </div>
        </div>
      </div>
    </section>
  );
}
