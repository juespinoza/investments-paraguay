import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function OfficesGrid({ title, items }: { title: string; items: any[] }) {
  return (
    <section className="container-page py-6">
      <h2 className="text-4xl font-semibold">{title}</h2>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {items.map((o) => (
          <Card key={o.name}>
            <div className="relative">
              <img
                src={o.imageUrl}
                alt={o.name}
                className="h-44 w-full object-cover"
              />
              <span className="absolute left-3 top-3 rounded-sm bg-secondary px-3 py-1 text-xs text-white">
                {o.city}
              </span>
            </div>
            <div className="p-5">
              <h3 className="font-semibold">{o.name}</h3>
              <p className="mt-2 text-sm text-secondary">{o.description}</p>
              <div className="mt-5">
                <Button href={o.ctaHref} variant="secondary">
                  Contactar
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
