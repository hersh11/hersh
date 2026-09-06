import { PageShell } from "@/components/page-shell";
import { PageHeader } from "@/components/card";
import { NowPlaying } from "@/components/now-playing";
import { TopArtists, TopTracks } from "@/components/top-lists";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  path: "spotify",
  description: "All of my Spotify stats in one place.",
  emoji: "🎶",
});

export default function SpotifyPage() {
  return (
    <PageShell>
      <PageHeader title="Spotify Stats">
        What I have been listening to, by way of Last.fm.
      </PageHeader>

      <NowPlaying />
      <TopArtists />
      <TopTracks />
    </PageShell>
  );
}
