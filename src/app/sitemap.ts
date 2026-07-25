import type { MetadataRoute } from "next";
import { getPublicTaxis } from "@/lib/queries";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      changeFrequency: "daily",
      priority: 1,
    },
  ];

  try {
    // Sitemaps need every taxi, not one paginated page.
    const { taxis } = await getPublicTaxis({ pageSize: 10000 });
    for (const taxi of taxis) {
      entries.push({
        url: `${SITE_URL}/taksi/${taxi.id}`,
        lastModified: new Date(taxi.updated_at),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  } catch {
    // A database outage must not break the sitemap response.
  }

  return entries;
}
