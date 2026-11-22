import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/dashboard/", "/cart/"],
    },
    sitemap: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://pharma-ph-orn-pe1d.vercel.app"}/sitemap.xml`,
  };
}
