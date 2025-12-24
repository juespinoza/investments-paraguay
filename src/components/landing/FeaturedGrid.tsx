import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

export function FeaturedGrid({
  title,
  items,
}: {
  title: string;
  items: any[];
}) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <div
          className="h-full w-full bg-cover bg-center bg-accent2"
          // style={{ backgroundImage: `url('/backgrounds/background.png')` }}
        />
        <div className="absolute inset-0 bg-white/70" />
      </div>
      <div className="container-page container-narrow relative py-4 md:py-8">
        {title ? <h2 className="text-4xl font-semibold">{title}</h2> : null}
        <div
          className={`mt-8 grid gap-6 ${
            items.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2"
          }`}
        >
          {items.map((p) => (
            <Card key={p.slug}>
              <div className="relative">
                {/* <img
                  src={p.imageUrl}
                  alt={p.title}
                  className="h-48 w-full object-cover"
                /> */}
                <Image
                  src={p.imageUrl}
                  width={400}
                  height={300}
                  alt={p.title}
                  className="h-48 w-full object-cover"
                />
                <span className="absolute right-0 top-3 bg-secondary px-3 py-1 text-xs text-white">
                  {p.badge ?? "Venta"}
                </span>
              </div>
              <div className="bottom-0 bg-white py-2 min-h-20">
                <h3 className="text-lg font-semibold px-2">{p.title}</h3>
                <p className="text-sm text-secondary px-2">{p.subtitle}</p>
              </div>
              <Button
                href={p.href ?? `/bienes-raices/propiedades/${p.slug}`}
                className="w-full"
              >
                Consultar
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
