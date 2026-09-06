import { PageShell } from "@/components/page-shell";
import { Prose } from "@/components/prose";
import { Mdx } from "@/components/mdx";
import { getContentPage } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { formatDate } from "@/lib/utils";

export const metadata = pageMetadata({
  path: "now",
  description: "The answer to what I'm up to.",
  emoji: "✨",
});

export default function NowPage() {
  const { content, updated } = getContentPage("now");

  return (
    <PageShell>
      <Prose>
        <Mdx source={content} />
      </Prose>

      {updated && (
        <p className="m-0 text-[0.65rem] text-zinc-600 dark:text-zinc-400">
          Last updated{" "}
          <time
            dateTime={updated}
            className="text-[0.65rem] text-zinc-700 underline decoration-dotted underline-offset-4 dark:text-zinc-300"
          >
            {formatDate(updated)}
          </time>
        </p>
      )}
    </PageShell>
  );
}
