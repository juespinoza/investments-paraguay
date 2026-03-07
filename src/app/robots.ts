import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/virtual-office/", "/admin/", "/private/"],
      },
    ],
    sitemap: "https://www.investmentsparaguay.com/sitemap.xml",
    host: "https://www.investmentsparaguay.com",
  };
}
