import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/virtual-office/", "/_next/"],
      },
    ],
    sitemap: "https://www.investmentsparaguay.com/sitemap.xml",
    host: "https://www.investmentsparaguay.com",
  };
}
