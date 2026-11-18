import type { Metadata } from "next";
import { site } from "./site";

/**
 * Per-page metadata in asrvd's `handle // page` title style.
 * Pass no `path` for the homepage, which is just the handle.
 *
 * Every page shares one tab icon: the "h" from my wordmark, served from the
 * file-based src/app/icon.svg, favicon.ico and apple-icon.png.
 */
export function pageMetadata({
  path,
  description,
}: {
  path?: string;
  description: string;
}): Metadata {
  const title = path ? `${site.handle} // ${path}` : site.handle;

  return {
    // `absolute` opts out of the root layout's `handle // %s` template, which
    // would otherwise prefix the handle a second time.
    title: { absolute: title },
    description,
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
