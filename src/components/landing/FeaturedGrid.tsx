import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function FeaturedGrid({
  title,
  items,
}: {
  title: string;
  items: any[];
}) {
  return (
    <section className="container-page py-14">
      {title ? <h2 className="text-4xl font-semibold">{title}</h2> : null}
      <div
        className={`mt-8 grid gap-6 ${
          items.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2"
        }`}
      >
        {items.map((p) => (
          <Card key={p.slug}>
            <div className="relative">
              <img
                src={p.imageUrl}
                alt={p.title}
                className="h-48 w-full object-cover"
              />
              <span className="absolute left-3 top-3 rounded-sm bg-secondary px-3 py-1 text-xs text-white">
                {p.badge ?? "Venta"}
              </span>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-secondary">{p.subtitle}</p>
              <div className="mt-5">
                <Button href={p.href ?? `/bienes-raices/propiedades/${p.slug}`}>
                  Consultar
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
