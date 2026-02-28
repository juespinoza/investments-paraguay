import Image from "next/image";
import Link from "next/link";
import { LocaleSwitcher } from "../i18n/LocaleSwitcher";
import { useTranslations } from "next-intl";

export function NavBar() {
  const t = useTranslations();

  return (
    <header className="border-b bg-white">
      <div className="container-page container-narrow flex items-center justify-between py-4">
        <Link href="/" className="font-semibold tracking-wide">
          <Image
            src="/images/logo.png"
            alt="Investments Paraguay"
            width={180}
            height={59.4}
          />
        </Link>

        <nav className="flex gap-3">
          <Link className="bg-primary px-4 py-2 text-sm text-white" href="/">
            {t("header.home")}
          </Link>
          <Link
            className="bg-secondary px-4 py-2 text-sm text-white"
            href="/bienes-raices"
          >
            {t("header.realEstate")}
          </Link>
          <Link
            className="bg-secondary px-4 py-2 text-sm text-white"
            href="/blog"
          >
            {t("header.blog")}
          </Link>
          <LocaleSwitcher />
        </nav>
      </div>
    </header>
  );
}
