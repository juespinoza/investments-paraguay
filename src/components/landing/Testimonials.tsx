export function Testimonials({
  title,
  items,
}: {
  title: string;
  items: { name: string; text: string }[];
}) {
  return (
    <section className="relative overflow-hidden py-6">
      <div className="absolute inset-0">
        <div
          className="h-full w-full bg-cover bg-center"
          style={{ backgroundImage: `url('/backgrounds/background.png')` }}
        />
        <div className="absolute inset-0 bg-white/70" />
      </div>
      <div className="container-page container-narrow relative py-8">
        <h2 className="text-4xl font-semibold">{title}</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {items.map((t) => (
            <div key={t.name} className="rounded-sm bg-accent2 p-6">
              <p className="text-primary font-playfair font-light italic">
                “{t.text}”
              </p>
              <p className="mt-4 text-sm font-semibold text-accent1">
                {t.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
