import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/dashboard/", "/cart/"],
    },
    sitemap: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://vitahub.vercel.app"}/sitemap.xml`,
  };
}
