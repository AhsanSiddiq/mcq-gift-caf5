import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Never block /_next/: Google needs the JS/CSS chunks to render pages (blocking them
        // made pages look empty to Googlebot and the AdSense crawler).
        disallow: ["/api/", "/admin/"],
      },
    ],
    sitemap: "https://www.thecahub.com/sitemap.xml",
    host: "https://www.thecahub.com",
  };
}
