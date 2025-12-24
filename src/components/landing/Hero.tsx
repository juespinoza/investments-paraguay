type Props = {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  backgroundImageUrl?: string;
};

export function Hero({
  title,
  subtitle,
  ctaLabel,
  ctaHref,
  backgroundImageUrl,
}: Props) {
  return (
    <section className="relative">
      <div className="absolute inset-0">
        <div
          className="h-full w-full bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url(${backgroundImageUrl ?? "/hero.jpg"})`,
          }}
        />
        <div className="absolute inset-0 bg-primary/60" />
      </div>

      <div className="container-page relative py-20 container-narrow">
        <h1 className="text-4xl md:text-6xl text-white font-semibold">
          {title}
        </h1>
        <p className="mt-4 text-lg md:text-xl text-accent2 max-w-2xl">
          {subtitle}
        </p>

        <div className="mt-8">
          <a className="btn-primary" href={ctaHref}>
            {ctaLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
