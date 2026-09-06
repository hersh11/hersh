import { lastfm, lastfmReady } from "@/lib/lastfm";
import { cached, unconfigured, upstreamFailed } from "@/lib/widget";

export async function GET() {
  if (!lastfmReady()) return unconfigured("Last.fm is not connected yet.");

  const res = await lastfm("user.getinfo", {}, 3600);
  if (!res.ok) return upstreamFailed("Last.fm", res.status);

  const json = await res.json();
  return cached({ url: json?.user?.url ?? "", playcount: Number(json?.user?.playcount ?? 0) }, 3600);
}
