import type { Metadata } from "next";
import { site } from "./site";

/**
 * Emoji favicon as an inline SVG data URI. asrvd proxies this through a service
 * on his own domain; doing it locally keeps the site free of outside deps.
 */
export function emojiIcon(emoji: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">${emoji}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/**
 * Per-page metadata in asrvd's `handle // page` title style.
 * Pass no `path` for the homepage, which is just the handle.
 */
export function pageMetadata({
  path,
  description,
  emoji,
}: {
  path?: string;
  description: string;
  emoji: string;
}): Metadata {
  const title = path ? `${site.handle} // ${path}` : site.handle;

  return {
    // `absolute` opts out of the root layout's `handle // %s` template, which
    // would otherwise prefix the handle a second time.
    title: { absolute: title },
    description,
    icons: { icon: emojiIcon(emoji) },
    openGraph: {
      title,
      description,
      siteName: site.name,
      locale: site.locale,
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
