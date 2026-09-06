import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import { PageShell } from "@/components/page-shell";
import { Prose } from "@/components/prose";
import { Mdx } from "@/components/mdx";
import { getAllPosts, getPost } from "@/lib/posts";
import { formatDate } from "@/lib/utils";
import { site } from "@/lib/site";
import { emojiIcon } from "@/lib/metadata";

type Props = { params: Promise<{ slug: string }> };

/** Pre-render every post at build time. */
export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: `blog/${post.slug}`,
    description: post.description,
    icons: { icon: emojiIcon("📝") },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      url: `${site.url}/blog/${post.slug}`,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <PageShell>
      <Link
        href="/blog"
        className="group flex w-fit items-center gap-2 text-sm text-zinc-500 no-underline duration-200 hover:text-zinc-700 dark:hover:text-zinc-400"
      >
        <FiArrowLeft className="duration-200 group-hover:-translate-x-1" aria-hidden />
        Back to blog
      </Link>

      <article>
        <header className="mb-8">
          <h1 className="m-0 text-[2.25rem] leading-tight font-extrabold text-zinc-900 dark:text-zinc-200">
            {post.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-zinc-600 dark:text-zinc-400">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden>&middot;</span>
            <span>{post.readingTime}</span>
            {post.tags.length > 0 && (
              <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
                {post.tags.map((tag) => (
                  <li key={tag} className="rounded bg-zinc-200 px-2 py-0.5 dark:bg-zinc-800">
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </header>

        <Prose>
          <Mdx source={post.content} />
        </Prose>
      </article>
    </PageShell>
  );
}
