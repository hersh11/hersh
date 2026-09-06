import { cn } from "@/lib/utils";

/** Typography wrapper shared by /about, /now and every blog post. */
export function Prose({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "prose prose-zinc dark:prose-invert w-full max-w-none",
        "prose-headings:font-extrabold prose-headings:tracking-tight",
        "prose-h1:text-zinc-900 dark:prose-h1:text-zinc-200",
        "prose-h2:text-zinc-800 dark:prose-h2:text-zinc-300",
        "prose-p:text-zinc-700 dark:prose-p:text-zinc-300",
        "prose-a:decoration-dotted prose-a:underline-offset-4",
        "prose-a:text-zinc-900 dark:prose-a:text-zinc-100",
        "prose-code:before:content-none prose-code:after:content-none",
        className,
      )}
    >
      {children}
    </div>
  );
}
