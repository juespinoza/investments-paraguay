import { Button } from "@/components/ui/Button";

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

export function TwoCol({
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
    <section className="container-page container-narrow py-14">
      <div className="grid gap-10 md:grid-cols-2 md:items-center">
        <div className="overflow-hidden bg-accent2">
          <img
            src={leftImageUrl}
            alt={leftImageAlt}
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <p className="text-sm uppercase tracking-widest text-secondary">
            {eyebrow}
          </p>
          <h2 className="mt-2 text-4xl font-semibold">{title}</h2>

          {meta?.length ? (
            <div className="mt-4 grid gap-1 text-secondary font-light">
              {meta.map((m) => (
                <div key={m.label}>
                  <span className="font-medium text-primary">{m.label}:</span>{" "}
                  {m.value}
                </div>
              ))}
            </div>
          ) : null}

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
