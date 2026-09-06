import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  /** ISO date, e.g. 2026-08-29 */
  date: string;
  tags: string[];
  /** Set `published: false` in frontmatter to keep a draft out of production. */
  published: boolean;
  readingTime: string;
};

export type Post = PostMeta & { content: string };

function readPost(fileName: string): Post {
  const slug = fileName.replace(/\.mdx?$/, "");
  const raw = fs.readFileSync(path.join(POSTS_DIR, fileName), "utf8");
  const { data, content } = matter(raw);

  if (!data.title) throw new Error(`Post "${fileName}" is missing a \`title\` in its frontmatter.`);
  if (!data.date) throw new Error(`Post "${fileName}" is missing a \`date\` in its frontmatter.`);

  return {
    slug,
    title: data.title,
    description: data.description ?? "",
    date: new Date(data.date).toISOString().slice(0, 10),
    tags: data.tags ?? [],
    // Drafts are visible in `next dev` so you can preview them, hidden in prod.
    published: data.published ?? true,
    readingTime: readingTime(content).text,
    content,
  };
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => /\.mdx?$/.test(f))
    .map(readPost)
    .filter((p) => p.published || process.env.NODE_ENV === "development")
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

/** Every tag used across published posts, most-used first. */
export function getAllTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of getAllPosts()) {
    for (const tag of post.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}
