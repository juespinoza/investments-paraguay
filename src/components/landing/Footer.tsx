import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { resolveLocale } from "@/lib/content/public-pages";

const WHATSAPP_URL = "https://wa.me/595985444801";

type FooterLink = {
  href:
    | "/"
    | "/bienes-raices"
    | "/blog"
    | "/nosotros"
    | "/legales"
    | "/cookies"
    | "/contacto";
  label: string;
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
      {children}
    </h2>
  );
}

function FooterLinks({
  links,
  locale,
}: {
  links: FooterLink[];
  locale: string;
}) {
  return (
    <ul className="mt-4 space-y-3">
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            locale={locale}
            className="text-sm text-[var(--stone)] opacity-80 transition-colors duration-150 hover:text-[var(--gold)] hover:opacity-100"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export async function Footer() {
  const t = await getTranslations();
  const locale = resolveLocale(await getLocale());

  const platformLinks: FooterLink[] = [
    { href: "/", label: t("header.home") },
    { href: "/bienes-raices", label: t("header.realEstate") },
    { href: "/blog", label: t("header.blog") },
    { href: "/nosotros", label: t("footer.us") },
  ];

  const legalLinks: FooterLink[] = [
    { href: "/legales", label: t("footer.legal") },
    { href: "/cookies", label: t("footer.cookies") },
    { href: "/contacto", label: t("footer.contact") },
  ];

  return (
    <footer className="bg-[linear-gradient(180deg,var(--carbon)_0%,var(--onyx)_100%)] text-[var(--ivory)]">
      <div className="border-t border-[var(--gold)]">
        <div className="mx-auto grid max-w-[1280px] gap-10 px-4 py-12 md:px-6 md:grid-cols-2 lg:grid-cols-[1.25fr_1fr_1fr] lg:gap-14 lg:py-14">
          <section>
            <div className="brand text-ivory">
              Investments<span>Paraguay</span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-7 text-[var(--stone)] opacity-80">
              Oportunidades exclusivas, contexto local y una forma más clara de
              invertir en Paraguay.
            </p>
            <p className="mt-5 text-xs uppercase tracking-[0.08em] text-muted">
              Asunción, Paraguay
            </p>
          </section>

          <section className="grid gap-8 sm:grid-cols-2 md:col-span-2 lg:col-span-1 lg:grid-cols-1">
            <div>
              <SectionTitle>Plataforma</SectionTitle>
              <FooterLinks links={platformLinks} locale={locale} />
            </div>

            <div>
              <SectionTitle>Legal</SectionTitle>
              <FooterLinks links={legalLinks} locale={locale} />
            </div>
          </section>

          <section className="md:justify-self-end lg:justify-self-auto">
            <div>
              <SectionTitle>Contacto directo</SectionTitle>
              <div className="mt-4 space-y-3">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm font-semibold text-[var(--stone)] transition-colors duration-150 hover:text-[var(--gold)]"
                >
                  +595 985 444 801
                </a>
                <p className="text-sm leading-6 text-[var(--stone)] opacity-70">
                  Lunes a viernes, 8:00 – 18:00
                </p>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-[2px] border border-current px-5 py-2 text-[13px] font-semibold uppercase tracking-[0.05em] text-[var(--ivory)] transition-colors duration-150 hover:bg-[var(--ivory)] hover:text-[var(--carbon)]"
                >
                  {t("header.cta")}
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="bg-[var(--carbon)] px-4 py-4 text-center text-xs text-muted md:px-6">
        © 2025 Investments Paraguay · Todos los derechos reservados
      </div>
    </footer>
  );
}
