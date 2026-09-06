import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/**
 * Loads a standalone prose page from content/<name>.mdx.
 * Frontmatter is optional; `updated` is used by /now.
 */
export function getContentPage(name: string) {
  const file = path.join(process.cwd(), "content", `${name}.mdx`);
  if (!fs.existsSync(file)) return { content: "", updated: null as string | null };

  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  return {
    content,
    updated: data.updated ? new Date(data.updated).toISOString().slice(0, 10) : null,
  };
}
