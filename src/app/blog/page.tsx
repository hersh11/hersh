import { PageShell } from "@/components/page-shell";
import { PageHeader } from "@/components/card";
import { PostList } from "@/components/post-list";
import { getAllPosts, getAllTags } from "@/lib/posts";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  path: "blog",
  description: "Posts on what I am building and learning.",
  emoji: "📝",
});

export default function BlogPage() {
  // Strip `content` before it crosses into the client component.
  const posts = getAllPosts().map(({ content: _content, ...meta }) => meta);
  const tags = getAllTags();

  return (
    <PageShell>
      <PageHeader title="Blog">
        {posts.length} {posts.length === 1 ? "post" : "posts"} on what I am building and learning.
      </PageHeader>

      <PostList posts={posts} tags={tags} />
    </PageShell>
  );
}
