"use client";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CldImage } from "next-cloudinary";
import { useTranslations } from "next-intl";

export function FeaturedGrid({
  title,
  items,
}: {
  title: string;
  items: any[];
}) {
  const t = useTranslations();

  return (
    <section className="px-4 py-8 md:py-10">
      <div className="container-page">
        {title ? (
          <h2 className="text-3xl font-semibold tracking-tight text-primary md:text-5xl">
            {title}
          </h2>
        ) : null}
        <div
          className={`mt-8 grid gap-6 ${
            items.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2"
          }`}
        >
          {items.map((p) => (
            <Card key={p.slug}>
              <div className="relative overflow-hidden rounded-[1.3rem]">
                <CldImage
                  src={p.coverImageUrl ?? "intentoPortada_wku8ef"}
                  width="400"
                  height="300"
                  crop={{
                    type: "auto",
                    source: true,
                  }}
                  alt={p.title}
                  className="h-72 w-full object-cover"
                />
                <span className="absolute left-4 top-4 rounded-full bg-[#142033]/78 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                  {p.badge ?? t("realEstate.badges.sale")}
                </span>
              </div>
              <div className="min-h-28 px-5 py-5">
                <h3 className="text-xl font-semibold text-primary">{p.title}</h3>
                <p className="mt-2 text-sm text-secondary">{p.subtitle}</p>
              </div>
              <Button
                href={p.href ?? `/bienes-raices/propiedades/${p.slug}`}
                className="mx-5 mb-5 w-[calc(100%-2.5rem)]"
              >
                {t("common.consult")}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
