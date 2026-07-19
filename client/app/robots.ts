import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://nexa-ai.example.com";
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/blog", "/items", "/about", "/contact", "/help"],
        disallow: ["/dashboard", "/api/", "/(auth)/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
