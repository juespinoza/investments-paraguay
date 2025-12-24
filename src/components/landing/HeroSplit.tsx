import { Button } from "@/components/ui/Button";

type Props = {
  brandLeft: string;
  brandRight: string;
  menuActive?: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  backgroundImageUrl: string;
  logoLeftUrl?: string;
};

export function HeroSplit({
  title,
  subtitle,
  ctaLabel,
  ctaHref,
  backgroundImageUrl,
  logoLeftUrl,
}: Props) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <div
          className="h-full w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImageUrl})` }}
        />
        <div className="absolute inset-0 bg-white/70" />
      </div>

      <div className="container-page container-narrow relative py-12 md:py-16">
        {logoLeftUrl ? (
          <div className="mb-4 flex items-center gap-3">
            {/* logo opcional para inmobiliaria */}
            <img src={logoLeftUrl} alt="logo" className="h-8 w-auto" />
          </div>
        ) : null}

        <h1 className="text-4xl md:text-6xl font-semibold leading-tight">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl font-light text-lg text-secondary">
          {subtitle}
        </p>

        <div className="mt-3">
          <Button href={ctaHref}>{ctaLabel}</Button>
        </div>
      </div>
    </section>
  );
}
