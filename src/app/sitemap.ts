import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/data";
import { absoluteUrl, productUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  const latest = products.reduce((d, p) => (p.createdAt > d ? p.createdAt : d), "2025-11-01T00:00:00.000Z");

  return [
    { url: absoluteUrl("/"), lastModified: latest, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/shop"), lastModified: latest, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/contact"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/privacy"), changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/terms"), changeFrequency: "yearly", priority: 0.3 },
    ...products.map((p) => ({
      url: absoluteUrl(productUrl(p)),
      lastModified: p.createdAt,
      changeFrequency: "weekly" as const,
      priority: p.soldOut ? 0.4 : 0.8,
      images: p.images.slice(0, 1).map((i) => absoluteUrl(i.src)),
    })),
  ];
}
