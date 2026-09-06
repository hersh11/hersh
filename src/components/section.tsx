import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

/** Homepage section: 40px heading, content, then a "more" link with a sliding arrow. */
export function Section({
  title,
  id,
  moreHref,
  moreLabel,
  external,
  last,
  children,
}: {
  title: string;
  id?: string;
  moreHref: string;
  moreLabel: string;
  external?: boolean;
  /** The last section sits closer to the footer, as on asrvd.me. */
  last?: boolean;
  children: React.ReactNode;
}) {
  const arrow = (
    <>
      {moreLabel}{" "}
      <span className="duration-200 group-hover:translate-x-1">
        <FiArrowRight />
      </span>
    </>
  );

  const linkClass =
    "group flex w-fit items-center gap-2 text-zinc-500 no-underline duration-200 " +
    "hover:text-zinc-700 dark:hover:text-zinc-400";

  return (
    <section className={`flex w-full flex-col gap-6 ${last ? "mb-10" : "mb-20"}`}>
      <h2
        id={id}
        className="m-0 text-[2.5rem] leading-none font-extrabold text-zinc-900 dark:text-zinc-200"
      >
        {title}
      </h2>

      {children}

      {external ? (
        <a href={moreHref} target="_blank" rel="noreferrer" className={linkClass}>
          {arrow}
        </a>
      ) : (
        <Link href={moreHref} className={linkClass}>
          {arrow}
        </Link>
      )}
    </section>
  );
}

/**
 * The gradient frame asrvd.me wraps its cards in: a 4px gradient border with the
 * card sitting inside it. The padding is load-bearing — at 1px it reads as a
 * hairline outline instead of the chunky frame the design is built around.
 */
export const gradientFrame =
  "block w-full rounded-lg bg-gradient-to-r from-zinc-500 to-stone-500 p-1 no-underline " +
  "shadow-lg shadow-zinc-800/10 duration-300 hover:scale-[103%] hover:shadow-xl " +
  "dark:shadow-zinc-200/10 dark:hover:shadow-zinc-200/10";

export function GradientCardInner({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full cursor-pointer flex-col justify-between gap-4 rounded-lg bg-zinc-200 p-4 dark:bg-zinc-800">
      {children}
    </div>
  );
}

/** Three-up grid used for both the blog cards and the repo cards. */
export function CardGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">{children}</div>;
}
