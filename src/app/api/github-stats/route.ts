import { site } from "@/lib/site";
import { githubFetch } from "@/lib/github";
import { cached, upstreamFailed } from "@/lib/widget";

type User = { public_repos: number; followers: number };
type Repository = { stargazers_count: number; fork: boolean };

export async function GET() {
  const [me, repos] = await Promise.all([
    githubFetch(`/users/${site.github}`, 3600),
    githubFetch(`/users/${site.github}/repos?per_page=100`, 3600),
  ]);

  if (!me.ok) return upstreamFailed("GitHub", me.status);
  if (!repos.ok) return upstreamFailed("GitHub", repos.status);

  const user = (await me.json()) as User;
  const all = (await repos.json()) as Repository[];

  // Stars on forks are someone else's; only count your own repos.
  const stars = all.filter((r) => !r.fork).reduce((sum, r) => sum + r.stargazers_count, 0);

  return cached({ stars, repos: user.public_repos, followers: user.followers }, 3600);
}
