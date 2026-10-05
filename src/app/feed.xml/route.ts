import { getBlogPosts } from "@/lib/blog";
import { site } from "@/lib/site";

/**
 * Minimal RSS 2.0 feed at /feed.xml so readers can subscribe. Lists every
 * post the site does, Medium stories included, linking each to where it lives.
 */
export async function GET() {
  const posts = (await getBlogPosts()).filter((p) => !p.draft);

  const items = posts
    .map((post) => {
      const link = escapeXml(post.source === "site" ? `${site.url}${post.href}` : post.href);
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(site.name)}</title>
    <link>${site.url}</link>
    <description>${escapeXml(site.bio)}</description>
    <language>en</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}

function escapeXml(unsafe: string) {
  return unsafe.replace(/[<>&'"]/g, (c) =>
    c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === "&" ? "&amp;" : c === "'" ? "&apos;" : "&quot;",
  );
}
