import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import { formatDate } from "@/lib/utils";
import { gradientFrame, GradientCardInner } from "./section";

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <Link href={`/blog/${post.slug}`} className={gradientFrame}>
      <GradientCardInner>
        <div>
          <h3 className="m-0 mb-6 w-full text-lg leading-none font-semibold tracking-tight text-zinc-800 dark:text-zinc-300">
            {post.title}
          </h3>
          {post.description && (
            <p className="m-0 line-clamp-3 text-sm tracking-tight text-zinc-700 dark:text-zinc-400">
              {post.description}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden>&middot;</span>
          <span>{post.readingTime}</span>
          {!post.published && (
            <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-amber-700 dark:text-amber-500">
              draft
            </span>
          )}
        </div>
      </GradientCardInner>
    </Link>
  );
}
