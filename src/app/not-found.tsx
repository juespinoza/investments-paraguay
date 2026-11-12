import Link from "next/link";
import { cormorantGaramond, dmSans } from "@/app/fonts";

// 404 para rutas fuera de /es, /en y /pt. Lleva su propio <html> porque el
// layout raíz solo pasa el contenido (ver src/app/layout.tsx).
export default function GlobalNotFound() {
  return (
    <html lang="es">
      <body className={`${dmSans.variable} ${cormorantGaramond.variable}`}>
        <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
          <h1 className="text-3xl">Página no encontrada</h1>
          <p>La página que buscás no existe o se movió.</p>
          <Link href="/es" className="underline">
            Ir al inicio
          </Link>
        </main>
      </body>
    </html>
  );
}
