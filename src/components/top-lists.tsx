"use client";

import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import { isUnconfigured, type TopArtist, type TopTrack, type WidgetResponse } from "@/lib/types";
import { Card } from "./card";
import { WidgetSkeleton, WidgetUnconfigured } from "./widget-state";

/** One numbered row, shared by the artists and tracks lists. */
function Row({
  index,
  title,
  subtitle,
  plays,
  url,
}: {
  index: number;
  title: string;
  subtitle?: string;
  plays: string;
  url: string;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-3 rounded-lg p-2 duration-200 hover:-translate-y-0.5 hover:bg-zinc-100/60 hover:shadow-lg dark:hover:bg-zinc-900/60"
    >
      <span className="w-5 shrink-0 text-right text-sm text-zinc-500 tabular-nums">{index + 1}</span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm text-zinc-900 dark:text-zinc-200">{title}</span>
        {subtitle && <span className="block truncate text-xs text-zinc-600 dark:text-zinc-500">{subtitle}</span>}
      </span>
      <span className="shrink-0 text-xs text-zinc-600 tabular-nums dark:text-zinc-400">{plays} plays</span>
    </a>
  );
}

function ListCard({ title, blurb, children }: { title: string; blurb: string; children: React.ReactNode }) {
  return (
    <Card className="flex flex-col gap-2">
      <div>
        <h2 className="m-0 font-semibold text-zinc-900 dark:text-zinc-200">{title}</h2>
        <p className="m-0 text-sm text-zinc-700 dark:text-zinc-400">{blurb}</p>
      </div>
      <div className="flex flex-col">{children}</div>
    </Card>
  );
}

export function TopArtists() {
  const { data, error } = useSWR<WidgetResponse<TopArtist[]>>("/api/top-artists", fetcher);

  if (error) return <WidgetUnconfigured title="Top artists" reason="Couldn't reach Last.fm." />;
  if (!data) return <WidgetSkeleton label="top artists" />;
  if (isUnconfigured(data)) return <WidgetUnconfigured title="Top artists" reason={data.reason} />;

  return (
    <ListCard title="Top Artists" blurb="according to the last 4 weeks">
      {data.map((artist, i) => (
        <Row key={artist.url} index={i} title={artist.name} plays={artist.playcount} url={artist.url} />
      ))}
    </ListCard>
  );
}

export function TopTracks() {
  const { data, error } = useSWR<WidgetResponse<TopTrack[]>>("/api/top-tracks", fetcher);

  if (error) return <WidgetUnconfigured title="Top tracks" reason="Couldn't reach Last.fm." />;
  if (!data) return <WidgetSkeleton label="top tracks" />;
  if (isUnconfigured(data)) return <WidgetUnconfigured title="Top tracks" reason={data.reason} />;

  return (
    <ListCard title="Top Tracks" blurb="according to the last 4 weeks">
      {data.map((track, i) => (
        <Row
          key={track.url}
          index={i}
          title={track.name}
          subtitle={track.artist}
          plays={track.playcount}
          url={track.url}
        />
      ))}
    </ListCard>
  );
}
