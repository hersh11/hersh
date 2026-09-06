import { Card } from "./card";

/**
 * Every live widget can be in one of three states: still loading, not wired up
 * to an account yet, or showing data. The first two look the same everywhere.
 */
export function WidgetSkeleton({ label }: { label: string }) {
  return (
    <Card className="flex min-h-24 items-center">
      <p className="m-0 animate-pulse text-sm text-zinc-600 dark:text-zinc-400">Loading {label}...</p>
    </Card>
  );
}

export function WidgetUnconfigured({ title, reason }: { title: string; reason: string }) {
  return (
    <Card className="flex min-h-24 flex-col justify-center gap-1">
      <p className="m-0 text-sm text-zinc-700 dark:text-zinc-300">{title}</p>
      <p className="m-0 text-xs text-zinc-600 dark:text-zinc-500">{reason}</p>
    </Card>
  );
}
