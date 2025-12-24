import { Button } from "@/components/ui/Button";
import { SectionTitle } from "./SectionTitle";

export function Specialization({
  items,
  ctaLabel,
  ctaHref,
}: {
  items: { title: string; lines: string[] }[];
  ctaLabel: string;
  ctaHref: string;
}) {
  return (
    <section className="container-page container-narrow py-6">
      <div className="grid gap-10 md:grid-cols-2 md:items-start">
        <div>
          <SectionTitle title="Especialización" subtitle="" align="left" />
          <div className="mt-6 space-y-6">
            {items.map((it) => (
              <div key={it.title}>
                <h3 className="font-semibold">{it.title}</h3>
                {it.lines.map((l) => (
                  <p className="font-light" key={l}>
                    {l}
                  </p>
                ))}
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Button href={ctaHref} variant="primary">
              {ctaLabel}
            </Button>
          </div>
        </div>

        <div className="overflow-hidden bg-accent2">
          <img
            src="/images/specialization.png"
            alt="Specialization"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
