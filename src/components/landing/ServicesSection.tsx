import { Button } from "@/components/ui/Button";
import { SectionTitle } from "./SectionTitle";
import Image from "next/image";
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
    <section className="container-page container-narrow py-6">
      <div className="flex flex-col md:flex-row gap-8 md:items-center">
        <div className="order-2 md:order-1 flex-1">
          <p className="text-sm uppercase tracking-widest text-secondary">
            {eyebrow}
          </p>
          {/* <h2 className="mt-2 text-4xl font-semibold">{title}</h2> */}
          <SectionTitle title={title} subtitle="" align="left" />
          {/* <div className="mt-6 space-y-6">
            {items.map((it, key) => (
              <div key={`servicios-${key}`}>
                <h3 className="font-semibold">{it.title}</h3>
                {it.lines.map((l) => (
                <p className="font-light">{it}</p>
                ))}
              </div>
            ))}
          </div> */}
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
