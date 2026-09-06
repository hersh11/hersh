"use client";

import Image from "next/image";
import useSWR from "swr";
import { SiDiscord } from "react-icons/si";
import fetcher from "@/lib/fetcher";
import { isUnconfigured, type LanyardUser, type WidgetResponse } from "@/lib/types";
import { Card } from "./card";
import { WidgetSkeleton, WidgetUnconfigured } from "./widget-state";

const statusColor: Record<LanyardUser["status"], string> = {
  online: "text-green-600 dark:text-green-400",
  idle: "text-yellow-600 dark:text-yellow-400",
  dnd: "text-red-600 dark:text-red-400",
  offline: "text-zinc-600 dark:text-zinc-400",
};

const statusLabel: Record<LanyardUser["status"], string> = {
  online: "online",
  idle: "idle",
  dnd: "do not disturb",
  offline: "offline",
};

export function Discord() {
  const { data, error } = useSWR<WidgetResponse<LanyardUser>>("/api/lanyard", fetcher, {
    refreshInterval: 60_000,
  });

  if (error) return <WidgetUnconfigured title="Discord" reason="Couldn't reach Lanyard." />;
  if (!data) return <WidgetSkeleton label="Discord presence" />;
  if (isUnconfigured(data)) return <WidgetUnconfigured title="Discord" reason={data.reason} />;

  return (
    <Card className="flex justify-between gap-4">
      <div className="flex flex-col justify-between gap-2">
        <p className={`m-0 text-xs lg:text-sm ${statusColor[data.status]}`}>
          <SiDiscord className="mr-2 inline-block h-4 w-4" aria-hidden />
          {statusLabel[data.status]}
        </p>
        <p className="m-0 text-sm text-zinc-900 lg:text-base dark:text-zinc-200">{data.displayName}</p>
      </div>

      {data.avatarURL && (
        <Image
          src={data.avatarURL}
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
