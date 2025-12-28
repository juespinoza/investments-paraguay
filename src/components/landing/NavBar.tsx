import Image from "next/image";
import Link from "next/link";

export function NavBar() {
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
            Inicio
          </Link>
          <Link
            className="bg-secondary px-4 py-2 text-sm text-white"
            href="/bienes-raices"
          >
            Bienes raíces
          </Link>
          <Link
            className="bg-secondary px-4 py-2 text-sm text-white"
            href="/blog"
          >
            Blog
          </Link>
        </nav>
      </div>
    </header>
  );
}
