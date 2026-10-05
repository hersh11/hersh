"use client"; // Error boundaries must be Client Components.

import { useEffect } from "react";
import Link from "next/link";

/**
 * Catches anything a page throws at runtime, so a failure renders inside the
 * site's own layout instead of Next's bare default error screen. Styled to
 * match not-found.tsx.
 */
export default function PageError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-[3rem] leading-none font-extrabold text-zinc-900 dark:text-zinc-100">Oops</h1>
      <p className="text-zinc-600 dark:text-zinc-400">Something went wrong loading this page.</p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => retry()}
          className="rounded-lg bg-zinc-800 px-4 py-2 text-sm text-zinc-100 transition-colors hover:bg-zinc-700 dark:bg-zinc-200 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-lg px-4 py-2 text-sm text-zinc-700 underline decoration-dotted underline-offset-4 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
        >
          Go home
        </Link>
      </div>
      {error.digest && <p className="text-xs text-zinc-500">Reference: {error.digest}</p>}
    </div>
  );
}
