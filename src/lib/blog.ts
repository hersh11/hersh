import { getAllPosts } from "./posts";
import { getMediumPosts } from "./medium";

/**
 * One shape for every post the site lists, wherever it lives: MDX files in
 * content/posts (rendered here) and Medium stories (linked out to).
 */
export type BlogPost = {
  title: string;
  description: string;
  /** ISO date, e.g. 2026-10-05 */
  date: string;
  tags: string[];
  readingTime: string;
  href: string;
  /** Hosted elsewhere: opens in a new tab and is labelled with its source. */
  source: "site" | "medium";
  draft: boolean;
};

/** Every listable post, newest first. Drafts only appear in `next dev`. */
export async function getBlogPosts(): Promise<BlogPost[]> {
  const local: BlogPost[] = getAllPosts().map((p) => ({
    title: p.title,
    description: p.description,
    date: p.date,
    tags: p.tags,
    readingTime: p.readingTime,
    href: `/blog/${p.slug}`,
    source: "site",
    draft: !p.published,
  }));

  const medium: BlogPost[] = (await getMediumPosts()).map((p) => ({
    title: p.title,
    description: p.description,
    date: p.date,
    tags: p.tags,
    readingTime: p.readingTime,
    href: p.url,
    source: "medium",
    draft: false,
  }));

  return [...local, ...medium].sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** Every tag across the given posts, most-used first. */
export function countTags(posts: BlogPost[]): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}
