import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { site } from "@/lib/site";
import { navItems } from "@/components/nav-items";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = navItems.map((item) => ({
    url: `${site.url}${item.href === "/" ? "" : item.href}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: item.href === "/" ? 1 : 0.8,
  }));

  const posts = getAllPosts()
    .filter((p) => p.published)
    .map((post) => ({
      url: `${site.url}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    }));

  return [...pages, ...posts];
}
