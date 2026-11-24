
import type { MetadataRoute } from "next";

import {
  getProducts,
  getPublishedContent,
} from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  try {
    const [products, blogs] = await Promise.all([
      getProducts(true),
      getPublishedContent("blogs"),
    ]);

    return [
      {
        url: base,
        changeFrequency: "weekly",
        priority: 1,
      },
      {
        url: `${base}/products`,
        changeFrequency: "weekly",
        priority: 0.9,
      },
      {
        url: `${base}/shipping-calculator`,
        changeFrequency: "monthly",
        priority: 0.8,
      },
      {
        url: `${base}/contact`,
        changeFrequency: "monthly",
        priority: 0.7,
      },
      {
        url: `${base}/faqs`,
        changeFrequency: "monthly",
        priority: 0.7,
      },
      {
        url: `${base}/blogs`,
        changeFrequency: "weekly",
        priority: 0.7,
      },
      ...products.map((p) => ({
        url: `${base}/products/${p.slug}`,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
      ...blogs.map((b: any) => ({
        url: `${base}/blogs/${b.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ];
  } catch {
    return [
      {
        url: base,
        priority: 1,
      },
    ];
  }
}
