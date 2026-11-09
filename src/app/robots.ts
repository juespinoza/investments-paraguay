import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /_next/ no se bloquea: ahí están el CSS, el JavaScript y las
        // imágenes optimizadas que Google necesita para ver las páginas.
        disallow: ["/api/", "/admin/", "/virtual-office/"],
      },
    ],
    sitemap: "https://www.investmentsparaguay.com/sitemap.xml",
    host: "https://www.investmentsparaguay.com",
  };
}
