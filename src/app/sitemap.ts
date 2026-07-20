import type { MetadataRoute } from "next";
import { STATIC_SITEMAP_URLS } from "@/data/urlMap";
import { absoluteUrl } from "@/lib/site";
import { getAllPageSlugs, getAllPostSlugs } from "@/lib/wordpress";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticUrls = STATIC_SITEMAP_URLS.map(path => ({
    url: absoluteUrl(path),
    lastModified: new Date(),
    changeFrequency: path === "/" ? "weekly" as const : "monthly" as const,
    priority: path === "/" ? 1 : 0.7
  }));

  try {
    const [posts, pages] = await Promise.all([getAllPostSlugs(), getAllPageSlugs()]);
    const wpUrls = [...posts, ...pages]
      .filter(item => item.slug !== "cart" && item.slug !== "checkout" && item.slug !== "my-account")
      .map(item => ({
        url: absoluteUrl(`/${item.slug}/`),
        lastModified: item.modified ? new Date(item.modified) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8
      }));

    return [...staticUrls, ...wpUrls];
  } catch {
    return staticUrls;
  }
}
