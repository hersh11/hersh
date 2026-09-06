import Image from "next/image";
import { PageShell } from "@/components/page-shell";
import { Section, CardGrid } from "@/components/section";
import { PostCard } from "@/components/post-card";
import { TopRepos } from "@/components/top-repos";
import { getAllPosts } from "@/lib/posts";
import { site } from "@/lib/site";

export default function HomePage() {
  const recent = getAllPosts().slice(0, 3);

  return (
    <PageShell>
      <section className="mb-20 flex w-full flex-col-reverse items-start justify-between gap-4 md:flex-row md:gap-8 lg:gap-14">
        <div className="leading-none">
          <h2 className="m-0 text-[2.5rem] font-extrabold text-zinc-900 dark:text-zinc-200">
            {site.name}
          </h2>
          <p className="m-0 mb-4 text-zinc-800 dark:text-zinc-300">{site.role}</p>
          <p className="m-0 text-sm text-zinc-700 dark:text-zinc-400">{site.bio}</p>
        </div>

        <Image
          src={site.avatar}
          alt=""
          width={128}
          height={128}
          priority
          className="m-0 h-32 w-32 min-w-32 rounded-full shadow-xl grayscale"
        />
      </section>

      <Section title="Recent Blogs" id="blogs" moreHref="/blog" moreLabel="Read More">
        {recent.length > 0 ? (
          <CardGrid>
            {recent.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </CardGrid>
        ) : (
          <p className="m-0 text-sm text-zinc-500">
            No posts yet. Add an .mdx file in content/posts/ to get started.
          </p>
        )}
      </Section>

      <Section
        title="Top Projects"
        id="projects"
        moreHref={`https://github.com/${site.github}?tab=repositories`}
        moreLabel="View More"
        external
        last
      >
        <TopRepos />
      </Section>
    </PageShell>
  );
}
