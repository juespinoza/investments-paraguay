import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { resolveLocale } from "@/lib/content/public-pages";

export async function Footer() {
  const t = await getTranslations();
  const locale = resolveLocale(await getLocale());

  return (
    <footer className="px-4 pb-6 pt-8 bg-[linear-gradient(180deg,var(--carbon)_0%,var(--onyx)_100%)]">
      <div className="container-page ">
        {/* <div className="section-shell px-6 py-10 text-sm text-[rgba(250,250,248,0.72)] md:px-10"> */}
        <div className="text-sm text-[rgba(250,250,248,0.72)] flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-md">
            <div className="inline-flex font-semibold text-primary">
              <div className="brand text-ivory">
                Investments<span>Paraguay</span>
              </div>
            </div>
            <p className="mt-5 text-sm leading-7 text-[rgba(250,250,248,0.62)]">
              {t("footer.tagline")}
            </p>
          </div>

          <div className="flex flex-col gap-5 md:items-end">
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              <Link
                className="text-sm hover:text-accent1"
                href="/legales"
                locale={locale}
              >
                {t("footer.legal")}
              </Link>
              <Link
                className="text-sm hover:text-accent1"
                href="/nosotros"
                locale={locale}
              >
                {t("footer.us")}
              </Link>
              <Link
                className="text-sm hover:text-accent1"
                href="/cookies"
                locale={locale}
              >
                {t("footer.cookies")}
              </Link>
              <Link
                className="text-sm hover:text-accent1"
                href="/contacto"
                locale={locale}
              >
                {t("footer.contact")}
              </Link>
            </div>
            <p className="text-xs uppercase tracking-[0.22em] text-[rgba(250,250,248,0.42)]">
              Investments Paraguay
            </p>
          </div>
        </div>
        {/* </div> */}
      </div>
    </footer>
  );
}
