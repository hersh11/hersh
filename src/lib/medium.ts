import { XMLParser } from "fast-xml-parser";
import readingTime from "reading-time";
import { site } from "./site";

/**
 * Posts published on Medium, read from the account's public RSS feed.
 * asrvd.me did the same with dev.to: write there, list here.
 *
 * Medium's feed only carries the 10 most recent stories, which is plenty for
 * the home page and /blog.
 */
export type MediumPost = {
  title: string;
  /** Canonical story URL, without Medium's ?source= tracking query. */
  url: string;
  /** ISO date, e.g. 2026-10-05 */
  date: string;
  description: string;
  tags: string[];
  readingTime: string;
};

type FeedItem = {
  title?: string;
  link?: string;
  pubDate?: string;
  category?: string[];
  "content:encoded"?: string;
};

const parser = new XMLParser({
  // Single-item lists would otherwise collapse into a bare object.
  isArray: (tag) => tag === "item" || tag === "category",
});

/** Strips tags and decodes the handful of entities Medium emits in bodies. */
function toText(html: string) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * The feed has no summary field. The opening paragraph stands in for one,
 * skipping image captions and one-line kickers that are too short to describe
 * anything.
 */
function summarise(html: string) {
  for (const [, p] of html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)) {
    const text = toText(p);
    if (text.length >= 40) return text.length > 200 ? `${text.slice(0, 200).replace(/\s+\S*$/, "")}…` : text;
  }
  return "";
}

export function parseMediumFeed(xml: string): MediumPost[] {
  const items: FeedItem[] = parser.parse(xml)?.rss?.channel?.item ?? [];

  return items
    .filter((item) => item.title && item.link && item.pubDate)
    .map((item) => {
      const body = item["content:encoded"] ?? "";
      const url = new URL(item.link!);
      url.search = "";
      return {
        title: String(item.title).trim(),
        url: url.toString(),
        date: new Date(item.pubDate!).toISOString().slice(0, 10),
        description: summarise(body),
        tags: (item.category ?? []).map((c) => String(c).trim()).filter(Boolean),
        readingTime: readingTime(toText(body)).text,
      };
    });
}

export async function getMediumPosts(): Promise<MediumPost[]> {
  if (!site.medium) return [];

  try {
    const res = await fetch(`https://medium.com/feed/@${site.medium}`, {
      headers: { Accept: "application/rss+xml, application/xml" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`Medium responded with ${res.status}`);
    return parseMediumFeed(await res.text());
  } catch (error) {
    // A blip at Medium shouldn't fail the build or blank the page; the site
    // just shows no Medium posts until the next revalidation.
    console.error("Failed to load Medium posts:", error);
    return [];
  }
}
