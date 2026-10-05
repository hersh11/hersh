"use client";

import { useMemo, useState } from "react";
import type { BlogPost } from "@/lib/blog";
import { PostCard } from "./post-card";
import { cn } from "@/lib/utils";

export function PostList({ posts, tags }: { posts: BlogPost[]; tags: { tag: string; count: number }[] }) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      const matchesTag = !activeTag || p.tags.includes(activeTag);
      const matchesQuery = !q || `${p.title} ${p.description} ${p.tags.join(" ")}`.toLowerCase().includes(q);
      return matchesTag && matchesQuery;
    });
  }, [posts, query, activeTag]);

  return (
    <>
      <div className="mb-8 flex flex-col gap-4">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts"
          aria-label="Search posts"
          className="w-full rounded-lg border border-zinc-300 bg-transparent px-4 py-2.5 text-sm text-zinc-800 placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:text-zinc-200"
        />

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <TagButton active={activeTag === null} onClick={() => setActiveTag(null)}>
              All ({posts.length})
            </TagButton>
            {tags.map(({ tag, count }) => (
              <TagButton key={tag} active={activeTag === tag} onClick={() => setActiveTag(tag)}>
                {tag} ({count})
              </TagButton>
            ))}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-zinc-500">Nothing matches that yet.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {filtered.map((post) => (
            <PostCard key={post.href} post={post} />
          ))}
        </div>
      )}
    </>
  );
}

function TagButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full px-3 py-1 text-xs transition-colors",
        active
          ? "bg-zinc-800 text-zinc-100 dark:bg-zinc-200 dark:text-zinc-900"
          : "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700",
      )}
    >
      {children}
    </button>
  );
}
