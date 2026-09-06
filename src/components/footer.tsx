import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-auto w-full pt-16 pb-4">
      <p className="m-0 text-sm text-zinc-700 dark:text-zinc-400">
        <a
          className="underline decoration-dotted underline-offset-4 duration-300 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-200"
          href="https://opensource.org/licenses/MIT"
          target="_blank"
          rel="noreferrer"
        >
          MIT
        </a>{" "}
        {site.since}-present &#169;{" "}
        <a
          className="underline decoration-dotted underline-offset-4 duration-300 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-200"
          href={`https://github.com/${site.github}`}
          target="_blank"
          rel="noreferrer"
        >
          {site.handle}
        </a>
      </p>
    </footer>
  );
}
