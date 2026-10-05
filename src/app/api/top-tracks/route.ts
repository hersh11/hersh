import { asArray, lastfm, lastfmReady } from "@/lib/lastfm";
import { cached, unconfigured, upstreamFailed } from "@/lib/widget";

type Track = { name: string; playcount: string; url: string; artist: { name: string } };

export async function GET() {
  if (!lastfmReady()) return unconfigured("Last.fm is not connected yet.");

  const res = await lastfm("user.gettoptracks", { limit: "10", period: "1month" }, 86400);
  if (!res.ok) return upstreamFailed("Last.fm", res.status);

  const json = await res.json();
  const tracks = asArray<Track>(json?.toptracks?.track).map((t) => ({
    name: t.name,
    playcount: t.playcount,
    url: t.url,
    artist: t.artist?.name ?? "",
  }));

  return cached(tracks, 86400);
}
