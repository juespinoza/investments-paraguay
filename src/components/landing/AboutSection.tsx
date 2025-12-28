import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { ImageCloudinary } from "../ui/ImageCloudinary";

type Props = {
  leftImageUrl: string;
  leftImageAlt: string;
  eyebrow: string;
  title: string;
  meta?: { label: string; value: string }[];
  paragraphs: string[];
  ctaLabel: string;
  ctaHref: string;
};

export function AboutSection({
  leftImageUrl,
  leftImageAlt,
  eyebrow,
  title,
  meta,
  paragraphs,
  ctaLabel,
  ctaHref,
}: Props) {
  return (
    <section className="container-page container-narrow py-6">
      <div className="grid gap-8 md:grid-cols-2 md:items-center">
        <div className="relative w-full max-w-137.5 aspect-3/2 overflow-hidden bg-1">
          {/* <Image
            src={leftImageUrl}
            width={300}
            height={200}
            alt={leftImageAlt}
            className="h-42 md:h-full w-full object-cover"
          /> */}
          <ImageCloudinary imageUrl={leftImageUrl} alt={leftImageAlt} />
        </div>

        <div>
          <p className="text-sm uppercase tracking-widest text-secondary">
            {eyebrow}
          </p>
          <h2 className="mt-2 text-4xl font-semibold">{title}</h2>

          {/* {meta?.length ? (
            <div className="mt-4 grid gap-1 text-secondary font-light">
              {meta.map((m) => (
                <div key={m.label}>
                  <span className="font-medium text-primary">{m.label}:</span>{" "}
                  {m.value}
                </div>
              ))}
            </div>
          ) : null} */}

          <div className="mt-5 space-y-3 text-secondary font-light">
            {paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          <div className="mt-7">
            <Button href={ctaHref}>{ctaLabel}</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
