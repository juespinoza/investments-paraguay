import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { resolveLocale } from "@/lib/content/public-pages";

export async function Footer() {
  const t = await getTranslations();
  const locale = resolveLocale(await getLocale());

  return (
    <footer className="px-4 pb-6 pt-8">
      <div className="container-page">
        <div className="section-shell bg-[linear-gradient(180deg,#0f1726_0%,#16233a_100%)] px-6 py-10 text-sm text-white/72 md:px-10">
          <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
            <div className="max-w-md">
              <div className="font-semibold text-primary bg-white">
                <Image
                  src="/images/logo.png"
                  alt="Investments Paraguay Footer"
                  width={180}
                  height={59.4}
                />
              </div>
              <p className="mt-5 text-sm leading-7 text-white/62">
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
              <p className="text-xs uppercase tracking-[0.22em] text-white/42">
                Investments Paraguay
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
