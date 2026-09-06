"use client";

import Image from "next/image";
import useSWR from "swr";
import { SiSpotify } from "react-icons/si";
import fetcher from "@/lib/fetcher";
import { isUnconfigured, type NowPlaying as NowPlayingData, type WidgetResponse } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Card } from "./card";
import { WidgetSkeleton, WidgetUnconfigured } from "./widget-state";

export function NowPlaying() {
  const { data, error } = useSWR<WidgetResponse<NowPlayingData>>("/api/now-playing", fetcher, {
    // Poll while the tab is open so the track changes without a refresh.
    refreshInterval: 60_000,
  });

  if (error) return <WidgetUnconfigured title="Now playing" reason="Couldn't reach Last.fm." />;
  if (!data) return <WidgetSkeleton label="now playing" />;
  if (isUnconfigured(data)) return <WidgetUnconfigured title="Now playing" reason={data.reason} />;

  return (
    <Card className="flex justify-between gap-4">
      <div className="flex flex-col justify-between gap-2">
        <p
          className={cn(
            "m-0 text-xs lg:text-sm",
            data.isPlaying ? "text-green-600 dark:text-green-400" : "text-zinc-600 dark:text-zinc-400",
          )}
        >
          <SiSpotify className="mr-2 inline-block h-4 w-4" aria-hidden />
          {data.isPlaying ? "Currently playing" : "Last played"}
        </p>

        <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-900 lg:gap-4 lg:text-base dark:text-zinc-200">
          <a href={data.songURL} target="_blank" rel="noreferrer" className="m-0 underline-offset-4 hover:underline">
            {data.songName}
          </a>
          <span className="text-zinc-600 dark:text-zinc-500">{"//"}</span>
          <span className="m-0">{data.artistName}</span>
        </div>
      </div>

      {data.imageURL && (
        <Image
          src={data.imageURL}
          alt=""
          width={80}
          height={80}
          unoptimized
          className="h-16 w-16 shrink-0 rounded-lg object-cover shadow-lg lg:h-20 lg:w-20"
        />
      )}
    </Card>
  );
}
