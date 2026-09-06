import { PageShell } from "@/components/page-shell";
import { Prose } from "@/components/prose";
import { Mdx } from "@/components/mdx";
import { getContentPage } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  path: "about",
  description: "Things you (maybe) want to know about me.",
  emoji: "🍥",
});

export default function AboutPage() {
  const { content } = getContentPage("about");

  return (
    <PageShell>
      <Prose>
        <Mdx source={content} />
      </Prose>
    </PageShell>
  );
}
