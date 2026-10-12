import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://my-local-info-seongnam.pages.dev";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: [
          "Googlebot",
          "Bingbot",
          "Yeti",
          "Daumoa",
          "Mediapartners-Google",
          "Google-Display-Ads-Bot",
        ],
        allow: "/",
      },
      {
        userAgent: [
          "OAI-SearchBot",
          "PerplexityBot",
          "Claude-SearchBot",
        ],
        allow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
