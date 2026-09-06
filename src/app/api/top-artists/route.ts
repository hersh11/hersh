import { lastfm, lastfmReady } from "@/lib/lastfm";
import { cached, unconfigured, upstreamFailed } from "@/lib/widget";

type Artist = { name: string; playcount: string; url: string };

export async function GET() {
  if (!lastfmReady()) return unconfigured("Last.fm is not connected yet.");

  const res = await lastfm("user.gettopartists", { limit: "10", period: "1month" }, 86400);
  if (!res.ok) return upstreamFailed("Last.fm", res.status);

  const json = await res.json();
  const artists: Artist[] = (json?.topartists?.artist ?? []).map((a: Artist) => ({
    name: a.name,
    playcount: a.playcount,
    url: a.url,
  }));

  return cached(artists, 86400);
}
