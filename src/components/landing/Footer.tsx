import Image from "next/image";

export function Footer() {
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
            <a className="hover:text-primary" href="#">
              Asesores
            </a>
            <a className="hover:text-primary" href="#">
              Legales
            </a>
            <a className="hover:text-primary" href="#">
              Nosotros
            </a>
            <a className="hover:text-primary" href="/blog">
              Blog
            </a>
            <a className="hover:text-primary" href="#">
              Cookies
            </a>
            <a className="hover:text-primary" href="#">
              Contacto
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
