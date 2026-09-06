import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-[3rem] leading-none font-extrabold text-zinc-900 dark:text-zinc-100">404</h1>
      <p className="text-zinc-600 dark:text-zinc-400">That page does not exist.</p>
      <Link
        href="/"
        className="rounded-lg bg-zinc-800 px-4 py-2 text-sm text-zinc-100 transition-colors hover:bg-zinc-700 dark:bg-zinc-200 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        Go home
      </Link>
    </div>
  );
}
