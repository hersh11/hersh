import { PageShell } from "@/components/page-shell";
import { PageHeader } from "@/components/card";
import { PostList } from "@/components/post-list";
import { countTags, getBlogPosts } from "@/lib/blog";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  path: "blog",
  description: "Posts on what I am building and learning.",
  emoji: "📝",
});

const mediumProfile = site.medium ? `https://medium.com/@${site.medium}` : null;

function MediumLink({ children }: { children: React.ReactNode }) {
  return (
    <a
      href={mediumProfile!}
      target="_blank"
      rel="noreferrer"
      className="underline decoration-dotted underline-offset-4 hover:text-zinc-900 dark:hover:text-zinc-200"
    >
      {children}
    </a>
  );
}

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const tags = countTags(posts);

  if (posts.length === 0) {
    return (
      <PageShell>
        <PageHeader title="Blog">
          No posts yet.
          {mediumProfile && (
            <>
              {" "}
              I write on <MediumLink>Medium</MediumLink>, so that&apos;s where the first one will appear.
            </>
          )}
        </PageHeader>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHeader title="Blog">
        {posts.length} {posts.length === 1 ? "post" : "posts"} on what I am building and learning.
        {mediumProfile && (
          <>
            {" "}
            Also on <MediumLink>Medium</MediumLink>.
          </>
        )}
      </PageHeader>

      <PostList posts={posts} tags={tags} />
    </PageShell>
  );
}
