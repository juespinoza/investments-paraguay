import Image from "next/image";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations();

  return (
    <footer className="mt-6 border-t bg-white">
      <div className="container-page py-10 text-sm text-secondary">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="font-semibold text-primary">
            <Image
              src="/images/logo.png"
              alt="Investments Paraguay Footer"
              width={180}
              height={59.4}
            />
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            {/* <a className="hover:text-primary" href="/bienes-raices/asesores">
              Asesores
            </a> */}
            <a className="hover:text-primary" href="legales">
              {t("footer.legal")}
            </a>
            <a className="hover:text-primary" href="/nosotros">
              {t("footer.us")}
            </a>
            {/* <a className="hover:text-primary" href="/blog">
              Blog
            </a> */}
            <a className="hover:text-primary" href="/cookies">
              {t("footer.cookies")}
            </a>
            <a className="hover:text-primary" href="/contacto">
              {t("footer.contact")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
