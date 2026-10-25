import { site } from "./site";
import { githubFetch } from "./github";

/**
 * Top Projects on the home page, in display order. Each card opens the
 * deployed site; a GitHub icon on the card opens the source. Three fills the
 * home page's three-column row exactly.
 *
 * Descriptions are trimmed from each site's own meta description, so editing
 * one there and here keeps them in step.
 *
 * Also deployed, not shown: Budget Buddy — https://budget.harshnarain.me,
 * repo `budget-tracker-basic`. Swap it in here to feature it.
 */
export const projects: Project[] = [
  {
    name: "Nihongo Path",
    description:
      "A free course in Japanese from the first character to JLPT N4, with Devanagari pronunciation guides for Hindi speakers.",
    url: "https://nihongo.harshnarain.me",
    repo: "learnjapanese",
  },
  {
    name: "Siddhi Sarees dashboard",
    description:
      "Order analytics dashboard built during an internship at Siddhi Sarees: sales, order status and the production workflow.",
    url: "https://siddhi.harshnarain.me",
    repo: "dashboard-siddhisaree",
  },
  {
    name: "ShareTheMeal",
    description:
      "Post surplus food for nearby NGOs and hunger spots, choose pickup or drop-off, and track every donation.",
    url: "https://sharethemeal.harshnarain.me",
    repo: "sharethemealapp",
  },
];

export type Project = {
  name: string;
  description: string;
  /** The deployed site. Clicking the card opens it. */
  url: string;
  /** Repo name under site.github: the card's source link and its star/fork counts. */
  repo: string;
};

export type ProjectWithStats = Project & {
  repoUrl: string;
  /** null when GitHub couldn't be reached; the card then leaves the counts out. */
  stars: number | null;
  forks: number | null;
};

type ApiRepo = { name: string; stargazers_count: number; forks_count: number };

export async function getProjects(): Promise<ProjectWithStats[]> {
  // Counts are a nice-to-have. The list itself is hand-written, so a GitHub
  // outage or rate limit never empties the section, it just hides the numbers.
  let byName = new Map<string, ApiRepo>();
  try {
    const res = await githubFetch(`/users/${site.github}/repos?per_page=100`, 43200);
    if (res.ok) byName = new Map(((await res.json()) as ApiRepo[]).map((r) => [r.name.toLowerCase(), r]));
  } catch (error) {
    console.error("Failed to load GitHub repo stats:", error);
  }

  return projects.map((p) => {
    const repo = byName.get(p.repo.toLowerCase());
    return {
      ...p,
      repoUrl: `https://github.com/${site.github}/${p.repo}`,
      stars: repo?.stargazers_count ?? null,
      forks: repo?.forks_count ?? null,
    };
  });
}
