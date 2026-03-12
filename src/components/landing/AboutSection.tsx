import { Button } from "@/components/ui/Button";
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
    <section className="px-4 py-8 md:py-10">
      <div className="container-page">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div className="surface-card relative aspect-[4/3] overflow-hidden rounded-[2rem]">
            <ImageCloudinary imageUrl={leftImageUrl} alt={leftImageAlt} />
          </div>

          <div className="surface-card rounded-[2rem] p-6 md:p-8">
            <div className="eyebrow">{eyebrow}</div>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-primary md:text-5xl">
              {title}
            </h2>

            {meta?.length ? (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {meta.map((item) => (
                  <div
                    key={`${item.label}-${item.value}`}
                    className="rounded-[1.25rem] border border-soft bg-white/65 px-4 py-4"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-accent1">
                      {item.label}
                    </p>
                    <p className="mt-2 text-base font-medium text-primary">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="mt-6 space-y-4 text-base font-light leading-8 text-secondary">
              {paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            <div className="mt-8">
              <Button href={ctaHref}>{ctaLabel}</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
