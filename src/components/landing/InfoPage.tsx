import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type IntroProps = {
  eyebrow: string;
  title: string;
  description: string;
  aside?: ReactNode;
};

export function InfoPageIntro({
  eyebrow,
  title,
  description,
  aside,
}: IntroProps) {
  return (
    <section className="px-4 py-8 md:py-10">
      <div className="container-page">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
          <div className="section-shell bg-[linear-gradient(135deg,#0f1726_0%,#18253d_52%,#243653_100%)] px-6 py-8 text-white shadow-[0_24px_80px_rgba(15,23,38,0.18)] md:px-10 md:py-12">
            <div className="eyebrow border-white/16 bg-white/10 text-white">
              {eyebrow}
            </div>
            <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
              {title}
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-white/78 md:text-lg">
              {description}
            </p>
          </div>

          {aside ? (
            <div className="surface-card rounded-[1.75rem] p-6 md:p-8">
              {aside}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function InfoSection({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("px-4 py-4 md:py-5", className)}>
      <div className="container-page">
        <div className="surface-card rounded-[1.75rem] p-6 md:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-primary md:text-3xl">
            {title}
          </h2>
          <div className="mt-5 space-y-4 text-base leading-8 text-secondary">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

export function InfoCards({
  items,
}: {
  items: Array<{ title: string; description: string }>;
}) {
  return (
    <section className="px-4 py-4 md:py-5">
      <div className="container-page grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.title}
            className="surface-card rounded-[1.5rem] p-5 md:p-6"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-accent1">
              {item.title}
            </p>
            <p className="mt-3 text-sm leading-7 text-secondary">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
