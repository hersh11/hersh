import { lastfm, lastfmReady, largestImage } from "@/lib/lastfm";
import { cached, unconfigured, upstreamFailed } from "@/lib/widget";

export async function GET() {
  if (!lastfmReady()) {
    return unconfigured("Set LASTFM_API_KEY and site.lastfm to show what you're playing.");
  }

  const res = await lastfm("user.getrecenttracks", { limit: "1" }, 60);
  if (!res.ok) return upstreamFailed("Last.fm", res.status);

  const json = await res.json();
  const song = json?.recenttracks?.track?.[0];
  if (!song) return unconfigured("No scrobbles yet.");

  return cached(
    {
      // Last.fm flags the in-progress track with @attr.nowplaying.
      isPlaying: Boolean(song["@attr"]?.nowplaying),
      songName: song.name,
      artistName: song.artist?.["#text"] ?? "",
      songURL: song.url,
      imageURL: largestImage(song.image),
    },
    60,
  );
}
