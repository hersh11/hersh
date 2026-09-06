import { cn } from "@/lib/utils";

/**
 * The gradient panel asrvd uses for links, stats and the Spotify widgets.
 * Subtle neutral-to-zinc wash that flips direction between themes.
 */
export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-lg bg-gradient-to-r from-neutral-200 to-zinc-200 p-4 shadow-xl",
        "dark:from-neutral-800 dark:to-zinc-800",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Heading block used at the top of every inner page. */
export function PageHeader({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div>
      <h1 className="m-0 mb-3 text-4xl leading-none font-extrabold text-zinc-900 dark:text-zinc-200">
        {title}
      </h1>
      {children && (
        <p className="m-0 text-base leading-tight text-zinc-800 dark:text-zinc-400">{children}</p>
      )}
    </div>
  );
}
