import type { ReactNode } from "react";
import "./globals.css";

// Cada sección arma su propio <html>: el sitio público en
// [locale]/layout.tsx (con el idioma de la URL) y la oficina virtual en
// (virtual-office)/virtual-office/layout.tsx.
//
// Antes este layout llamaba a getLocale(), que lee las cabeceras de cada
// pedido y volvía dinámicas todas las páginas: Vercel no guardaba nada en
// caché (Cache-Control: private, no-store) y el revalidate de cada página
// no tenía efecto.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
