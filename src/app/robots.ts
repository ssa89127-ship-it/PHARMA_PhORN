import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/dashboard/", "/cart/"],
    },
    sitemap: "https://vitahub.uz/sitemap.xml",
  };
}
