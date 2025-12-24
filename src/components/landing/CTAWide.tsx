export function CTAWide({
  line1,
  highlight,
}: {
  line1: string;
  highlight: string;
}) {
  return (
    <section className="relative my-4 overflow-hidden">
      <div className="absolute inset-0">
        <div className="h-full w-full bg-[radial-gradient(circle_at_center,rgba(10,26,47,0.06),transparent_60%)]" />
      </div>

      <div className="container-page relative py-14 text-center">
        <p className="text-2xl md:text-3xl font-semibold">
          {line1} <span className="text-accent1">{highlight}</span>
        </p>
      </div>
    </section>
  );
}
