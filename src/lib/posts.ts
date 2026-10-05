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

  const date = new Date(data.date);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Post "${fileName}" has an invalid \`date\` (${data.date}). Use YYYY-MM-DD.`);
  }

  return {
    slug,
    title: data.title,
    description: data.description ?? "",
    date: date.toISOString().slice(0, 10),
    tags: normaliseTags(data.tags),
    // Drafts are visible in `next dev` so you can preview them, hidden in prod.
    published: data.published ?? true,
    readingTime: readingTime(content).text,
    content,
  };
}

/**
 * `tags: typescript` (no brackets) is valid YAML for a plain string, which would
 * otherwise be iterated character by character. Accept it as a single tag.
 */
function normaliseTags(tags: unknown): string[] {
  if (tags == null) return [];
  const list = Array.isArray(tags) ? tags : [tags];
  return list.map((t) => String(t).trim()).filter(Boolean);
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
