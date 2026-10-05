"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { FiExternalLink } from "react-icons/fi";
import fetcher from "@/lib/fetcher";
import { site } from "@/lib/site";
import {
  isUnconfigured,
  type GithubStats,
  type Scrobbles,
  type WakatimeStats,
  type WidgetResponse,
} from "@/lib/types";
import { Card } from "./card";

/** Years since the birth date, to nine decimals — the ticking counter. */
function ageNow() {
  const ms = Date.now() - new Date(site.birthDate).getTime();
  return (ms / 1000 / 60 / 60 / 24 / 365.25).toFixed(9);
}

function useTickingAge() {
  // Starts null so the server and the first client render agree; the interval
  // fills it in right after mount.
  const [age, setAge] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setAge(ageNow());
    tick();
    const id = setInterval(tick, 50);
    return () => clearInterval(id);
  }, []);

  return age;
}

/** Pulls the value out of a widget response, or null if it isn't usable. */
function value<T>(data: WidgetResponse<T> | undefined): T | null {
  if (!data || isUnconfigured(data)) return null;
  return data as T;
}

export function Stats() {
  const age = useTickingAge();
  const github = value(useSWR<WidgetResponse<GithubStats>>("/api/github-stats", fetcher).data);
  const scrobbles = value(useSWR<WidgetResponse<Scrobbles>>("/api/scrobbles", fetcher).data);
  // A null key tells SWR not to fetch: no username, no card, no request.
  const wakatime = value(
    useSWR<WidgetResponse<WakatimeStats>>(site.wakatime ? "/api/wakatime" : null, fetcher).data,
  );

  const cards = [
    { title: "My Age", value: age, link: "/about" },
    { title: "GitHub Stars", value: github?.stars, link: `https://github.com/${site.github}` },
    {
      title: "GitHub Followers",
      value: github?.followers,
      link: `https://github.com/${site.github}?tab=followers`,
    },
    { title: "Public Repos", value: github?.repos, link: `https://github.com/${site.github}?tab=repositories` },
    {
      title: "Scrobbles",
      value: scrobbles?.playcount?.toLocaleString(),
      link: scrobbles?.url || "https://last.fm",
    },
    // Only shown once site.wakatime is set; otherwise it would read "-" forever.
    ...(site.wakatime
      ? [
          {
            title: "Coding Hours",
            value: wakatime ? Math.round(wakatime.total_seconds / 3600).toLocaleString() : undefined,
            link: `https://wakatime.com/@${site.wakatime}`,
          },
        ]
      : []),
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {cards.map((card) => {
        const external = card.link.startsWith("http");
        return (
          <Card key={card.title} className="flex flex-col justify-between gap-2">
            <a
              className="m-0 flex items-center gap-4 text-base text-zinc-700 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
              href={card.link}
              target={external ? "_blank" : undefined}
              rel={external ? "noreferrer" : undefined}
            >
              {card.title}
              <FiExternalLink aria-hidden />
            </a>
            {/* Server renders the dash; the value appears once data arrives. */}
            <p className="m-0 text-xl font-semibold text-zinc-900 tabular-nums dark:text-zinc-200">
              {card.value ?? "-"}
            </p>
          </Card>
        );
      })}
    </div>
  );
}
