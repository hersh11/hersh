import Link from "next/link";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode, { type Options as PrettyCodeOptions } from "rehype-pretty-code";

const prettyCodeOptions: PrettyCodeOptions = {
  // Two themes so the CSS can show whichever matches the current mode.
  theme: { light: "github-light", dark: "github-dark-dimmed" },
  keepBackground: false,
  defaultLang: "plaintext",
};

/**
 * Elements MDX gets to use. Anything not listed falls back to the
 * `prose` styles from @tailwindcss/typography.
 */
const components = {
  // Internal links stay client-side; external ones open in a new tab.
  a: ({ href = "", children, ...props }: React.ComponentProps<"a">) => {
    if (href.startsWith("/")) {
      return (
        <Link href={href} {...props}>
          {children}
        </Link>
      );
    }
    // Mail and phone links hand off to an app; a new tab would just sit blank.
    if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
      return (
        <a href={href} {...props}>
          {children}
        </a>
      );
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  },

  // Images in posts: put the file in /public and reference it as /my-image.png
  // width/height are dropped because Markdown types them as strings, which
  // next/image rejects; the fixed pair below plus h-auto keeps the ratio.
  // Remote URLs skip the optimizer: next/image refuses any host not listed in
  // next.config.ts, which would fail the whole build over one pasted link.
  img: ({ src, alt, width: _w, height: _h, ...props }: React.ComponentProps<"img">) => {
    const url = typeof src === "string" ? src : "";
    return (
      <Image
        src={url}
        alt={alt ?? ""}
        width={1200}
        height={630}
        unoptimized={!url.startsWith("/")}
        className="h-auto w-full rounded-lg"
        {...props}
      />
    );
  },

  /** <Callout>...</Callout> — usable directly inside any .mdx post. */
  Callout: ({ children, type = "note" }: { children: React.ReactNode; type?: "note" | "warn" }) => (
    <aside
      className={
        type === "warn"
          ? "my-6 rounded-lg border-l-4 border-amber-500 bg-amber-500/10 px-4 py-3 [&>p]:my-0"
          : "my-6 rounded-lg border-l-4 border-zinc-400 bg-zinc-500/10 px-4 py-3 [&>p]:my-0"
      }
    >
      {children}
    </aside>
  ),
};

export function Mdx({ source }: { source: string }) {
  return (
    <MDXRemote
      source={source}
      components={components}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            rehypeSlug,
            [rehypePrettyCode, prettyCodeOptions],
            [
              rehypeAutolinkHeadings,
              {
                behavior: "append",
                properties: { className: ["heading-anchor"], ariaHidden: true, tabIndex: -1 },
                content: { type: "text", value: "#" },
              },
            ],
          ],
        },
      }}
    />
  );
}
