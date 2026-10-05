import { site } from "./site";
import type { Repo } from "./types";
import { githubFetch } from "./github";

/**
 * asrvd shows GitHub's "pinned" repos, which are only exposed through the
 * GraphQL API and need a token. This uses the public REST list sorted by stars
 * instead: no token, no rate-limit headaches, near-identical result.
 *
 * To curate the order by hand, list slugs in `featured` below.
 */
const featured: string[] = [];

export async function getTopRepos(limit = 3): Promise<Repo[]> {
  const res = await githubFetch(`/users/${site.github}/repos?per_page=100&sort=updated`, 43200);
  if (!res.ok) return [];

  type ApiRepo = {
    name: string;
    description: string | null;
    html_url: string;
    stargazers_count: number;
    forks_count: number;
    fork: boolean;
    archived: boolean;
  };

  const all = ((await res.json()) as ApiRepo[])
    // A repo named after the account is GitHub's profile README, not a project.
    .filter((r) => !r.fork && !r.archived && r.name.toLowerCase() !== site.github.toLowerCase())
    .map((r) => ({
      name: r.name,
      description: r.description ?? "",
      url: r.html_url,
      stars: r.stargazers_count,
      forks: r.forks_count,
    }));

  if (featured.length > 0) {
    const bySlug = new Map(all.map((r) => [r.name, r]));
    return featured.map((slug) => bySlug.get(slug)).filter((r): r is Repo => Boolean(r));
  }

  return all.sort((a, b) => b.stars - a.stars).slice(0, limit);
}
