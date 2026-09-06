import { FiStar } from "react-icons/fi";
import { VscRepoForked } from "react-icons/vsc";
import { getTopRepos } from "@/lib/repos";
import { gradientFrame, GradientCardInner, CardGrid } from "./section";

export async function TopRepos({ limit = 3 }: { limit?: number }) {
  const repos = await getTopRepos(limit);

  if (repos.length === 0) {
    return <p className="m-0 text-sm text-zinc-500">Couldn&apos;t load repositories from GitHub right now.</p>;
  }

  return (
    <CardGrid>
      {repos.map((repo) => (
        <a key={repo.url} href={repo.url} target="_blank" rel="noreferrer" className={gradientFrame}>
          <GradientCardInner>
            <div>
              <h3 className="m-0 mb-6 w-full text-lg leading-none font-semibold tracking-tight text-zinc-800 dark:text-zinc-200">
                {repo.name}
              </h3>
              <p className="m-0 mb-6 w-full text-sm tracking-tight text-zinc-700 dark:text-zinc-300">
                {repo.description || "No description yet."}
              </p>
            </div>

            <div className="flex gap-6">
              <span className="flex items-center gap-2 text-base font-semibold text-zinc-600 dark:text-zinc-400">
                <FiStar aria-hidden /> <span className="m-0">{repo.stars}</span>
              </span>
              <span className="flex items-center gap-2 text-base font-semibold text-zinc-600 dark:text-zinc-400">
                <VscRepoForked aria-hidden /> <span className="m-0">{repo.forks}</span>
              </span>
            </div>
          </GradientCardInner>
        </a>
      ))}
    </CardGrid>
  );
}
