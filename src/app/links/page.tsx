import { PageShell } from "@/components/page-shell";
import { PageHeader, Card } from "@/components/card";
import { pageMetadata } from "@/lib/metadata";
import { links } from "@/lib/links";

export const metadata = pageMetadata({
  path: "links",
  description: "All of my links in one place.",
  emoji: "📎",
});

export default function LinksPage() {
  return (
    <PageShell>
      <PageHeader title="Links">All my profile links to find me on the web.</PageHeader>

      {links.length === 0 ? (
        <p className="m-0 text-sm text-zinc-500">
          No links yet — fill them in at <code>src/lib/links.ts</code>.
        </p>
      ) : (
        <Card>
          <div className="flex w-full flex-col gap-2">
            {links.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target={link.url.startsWith("mailto:") ? undefined : "_blank"}
                rel="noreferrer"
                className="flex w-full items-center justify-between rounded-lg bg-zinc-100/60 p-2 no-underline duration-200 hover:-translate-y-1 hover:shadow-lg dark:bg-zinc-900/60"
              >
                <span className="m-0 text-sm text-zinc-800 lg:text-base dark:text-zinc-300">
                  {link.name} <span className="text-zinc-500 dark:text-zinc-600">{" // "}</span>{" "}
                  {link.value}
                </span>
                <span className="m-0 text-zinc-800 dark:text-zinc-300">
                  <link.icon aria-hidden />
                </span>
              </a>
            ))}
          </div>
        </Card>
      )}
    </PageShell>
  );
}
