import { Button } from "@/components/ui/Button";
import { SectionTitle } from "./SectionTitle";
import Image from "next/image";

export function ServicesSection({
  items,
  ctaLabel,
  ctaHref,
}: {
  items: string[];
  ctaLabel: string;
  ctaHref: string;
}) {
  return (
    <section className="container-page container-narrow py-6">
      <div className="flex flex-col md:flex-row gap-8 ">
        <div className="order-2 md:order-1 flex-1">
          <p className="text-sm uppercase tracking-widest text-secondary">
            {`Servicios`}
          </p>
          <SectionTitle title="Mi especialización" subtitle="" align="left" />
          <div className="mt-6 space-y-6">
            {items.map((it, key) => (
              <div key={`servicios-${key}`}>
                {/* <h3 className="font-semibold">{it.title}</h3> */}
                {/* {it.lines.map((l) => ( */}
                <p className="font-light">{it}</p>
                {/* ))} */}
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Button href={ctaHref} variant="primary">
              {ctaLabel}
            </Button>
          </div>
        </div>

        <div className="overflow-hidden bg-accent2 order-1 md:order-2 flex-1">
          <Image
            src="/images/specialization.png"
            width={400}
            height={300}
            alt="Specialization"
            className="h-42 md:h-full w-full object-cover "
          />
        </div>
      </div>
    </section>
  );
}
