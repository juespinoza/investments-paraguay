export function Testimonials({
  title,
  items,
}: {
  title: string;
  items: { name: string; text: string }[];
}) {
  return (
    <section className="px-4 py-8 md:py-10">
      <div className="container-page">
        <div className="mb-8">
          <h2 className="text-3xl font-semibold tracking-tight text-primary md:text-5xl">
            {title}
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {items.map((t) => (
            <div
              key={t.name}
              className="surface-card rounded-[1.75rem] p-6 md:p-7"
            >
              <div className="mb-5 h-px w-14 bg-accent1" />
              <p className="font-playfair text-xl font-light italic text-primary">
                “{t.text}”
              </p>
              <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-accent1">
                {t.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
