export function Testimonials({
  title,
  items,
}: {
  title: string;
  items: { name: string; text: string }[];
}) {
  return (
    <section className="container-page py-14">
      <h2 className="text-4xl font-semibold">{title}</h2>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {items.map((t) => (
          <div key={t.name} className="rounded-sm border bg-white p-6">
            <p className="text-secondary">“{t.text}”</p>
            <p className="mt-4 text-sm font-semibold text-accent1">{t.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
