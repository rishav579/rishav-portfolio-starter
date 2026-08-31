import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/**
 * Single-page site: exactly one URL — the canonical homepage.
 * No other routes exist by design; do not invent any (Phase 10 contract).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
