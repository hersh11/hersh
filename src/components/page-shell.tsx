import { Footer } from "./footer";

/**
 * Page frame from asrvd.me: `p-8`, full height, footer pinned to the bottom.
 * The top margin only applies below `md`, where it clears the floating nav.
 */
export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex h-full min-h-screen w-full flex-col items-start p-8">
      <section className="mt-16 mb-12 flex w-full flex-col gap-6 md:mt-0">{children}</section>
      <Footer />
    </div>
  );
}
