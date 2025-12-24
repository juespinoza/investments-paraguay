export function Footer() {
  return (
    <footer className="mt-16 border-t bg-white">
      <div className="container-page py-10 text-sm text-secondary">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="font-semibold text-main">INVESTMENTS PARAGUAY</div>
          <div className="flex flex-col md:flex-row gap-6">
            <a className="hover:text-main" href="#">
              Asesores
            </a>
            <a className="hover:text-main" href="#">
              Legales
            </a>
            <a className="hover:text-main" href="#">
              Nosotros
            </a>
            <a className="hover:text-main" href="/blog">
              Blog
            </a>
            <a className="hover:text-main" href="#">
              Cookies
            </a>
            <a className="hover:text-main" href="#">
              Contacto
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
