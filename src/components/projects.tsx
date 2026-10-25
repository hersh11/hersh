import { FiArrowUpRight, FiStar } from "react-icons/fi";
import { SiGithub } from "react-icons/si";
import { VscRepoForked } from "react-icons/vsc";
import { getProjects } from "@/lib/projects";
import { cn } from "@/lib/utils";
import { gradientFrame, GradientCardInner, CardGrid } from "./section";

/**
 * Hand-picked projects. The whole card opens the live site and the GitHub icon
 * opens the source. Links can't nest, so the title's link is stretched over the
 * card with an ::after overlay and the GitHub link sits above it (z-10).
 */
export async function Projects() {
  const projects = await getProjects();

  return (
    <CardGrid>
      {projects.map((project) => (
        <div key={project.url} className={cn(gradientFrame, "relative")}>
          <GradientCardInner>
            <div>
              <h3 className="m-0 mb-1 w-full text-lg leading-none font-semibold tracking-tight text-zinc-800 dark:text-zinc-200">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  className="no-underline after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-zinc-500"
                >
                  {project.name}
                </a>
              </h3>
              <p className="m-0 mb-5 flex items-center gap-0.5 text-xs text-zinc-600 dark:text-zinc-400">
                {new URL(project.url).hostname}
                <FiArrowUpRight aria-hidden />
              </p>
              <p className="m-0 mb-6 w-full text-sm tracking-tight text-zinc-700 dark:text-zinc-300">
                {project.description}
              </p>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex gap-6">
                {project.stars !== null && (
                  <span className="flex items-center gap-2 text-base font-semibold text-zinc-600 dark:text-zinc-400">
                    <FiStar aria-hidden /> <span className="m-0">{project.stars}</span>
                    <span className="sr-only">stars</span>
                  </span>
                )}
                {project.forks !== null && (
                  <span className="flex items-center gap-2 text-base font-semibold text-zinc-600 dark:text-zinc-400">
                    <VscRepoForked aria-hidden /> <span className="m-0">{project.forks}</span>
                    <span className="sr-only">forks</span>
                  </span>
                )}
              </div>

              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.name} source code on GitHub`}
                title="Source on GitHub"
                className="relative z-10 rounded p-1 text-zinc-600 duration-200 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-zinc-500 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                <SiGithub size="1.1rem" aria-hidden />
              </a>
            </div>
          </GradientCardInner>
        </div>
      ))}
    </CardGrid>
  );
}
