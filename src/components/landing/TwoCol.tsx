import { Button } from "@/components/ui/Button";
import { SectionTitle } from "./SectionTitle";
import { ImageCloudinary } from "../ui/ImageCloudinary";

export function TwoCol({
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
    <section className="container-page container-narrow py-6">
      <div className="flex flex-col md:flex-row gap-8 md:items-center">
        <div className="order-2 md:order-1 flex-1">
          <p className="text-sm uppercase tracking-widest text-secondary">
            {eyebrow}
          </p>
          <SectionTitle title={title} subtitle="" align="left" />
          <div className="mt-5 space-y-3 text-secondary font-light">
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

        <div className="relative w-full max-w-137.5 aspect-3/2 overflow-hidden bg-accent2 order-1 md:order-2">
          <ImageCloudinary imageUrl={rightImageUrl} alt={rightImageAlt} />
        </div>
      </div>
    </section>
  );
}
