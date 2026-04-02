import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "The CA Hub",
    short_name: "CA Hub",
    description: "The All-in-One Toolkit for CA Students in Pakistan. Practice MCQs, build Big 4 CVs, and track your journey.",
    start_url: "/",
    display: "standalone",
    background_color: "#111113",
    theme_color: "#3DB371",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
