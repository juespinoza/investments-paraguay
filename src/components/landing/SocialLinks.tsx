export function SocialLinks({
  title,
  items,
}: {
  title: string;
  items: { label: string; value: string; href: string }[];
}) {
  return (
    <section className="container-page py-14">
      <h2 className="text-4xl font-semibold">{title}</h2>
      <div className="mt-8 grid gap-3 text-secondary">
        {items.map((i) => (
          <a
            key={i.label}
            href={i.href}
            className="flex items-center justify-between rounded-sm border bg-white px-4 py-3 hover:bg-accent2"
          >
            <span className="font-medium text-main">{i.label}</span>
            <span>{i.value}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
