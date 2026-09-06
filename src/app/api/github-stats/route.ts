import { site } from "@/lib/site";
import { cached, upstreamFailed } from "@/lib/widget";

type User = { public_repos: number; followers: number };
type Repository = { stargazers_count: number; fork: boolean };

/** Unauthenticated GitHub API: 60 req/hour per IP, plenty behind the cache. */
export async function GET() {
  const [me, repos] = await Promise.all([
    fetch(`https://api.github.com/users/${site.github}`, { next: { revalidate: 3600 } }),
    fetch(`https://api.github.com/users/${site.github}/repos?per_page=100`, {
      next: { revalidate: 3600 },
    }),
  ]);

  if (!me.ok) return upstreamFailed("GitHub", me.status);
  if (!repos.ok) return upstreamFailed("GitHub", repos.status);

  const user = (await me.json()) as User;
  const all = (await repos.json()) as Repository[];

  // Stars on forks are someone else's; only count your own repos.
  const stars = all.filter((r) => !r.fork).reduce((sum, r) => sum + r.stargazers_count, 0);

  return cached({ stars, repos: user.public_repos, followers: user.followers }, 3600);
}
