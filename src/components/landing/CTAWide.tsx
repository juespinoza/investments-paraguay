export function CTAWide({
  line1,
  highlight,
}: {
  line1: string;
  highlight: string;
}) {
  return (
    <section className="px-4 py-6 md:py-8">
      <div className="container-page">
        <div className="section-shell bg-[linear-gradient(135deg,#0f1726_0%,#1f2f47_55%,#263754_100%)] px-6 py-8 text-center shadow-[0_24px_80px_rgba(15,23,38,0.2)] md:px-12 md:py-10">
          <div className="mx-auto max-w-4xl">
            <p className="text-2xl font-semibold leading-tight text-white md:text-4xl">
              {line1} <span className="text-accent1">{highlight}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
