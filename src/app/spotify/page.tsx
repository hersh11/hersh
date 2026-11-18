import { PageShell } from "@/components/page-shell";
import { PageHeader } from "@/components/card";
import { NowPlaying } from "@/components/now-playing";
import { TopArtists, TopTracks } from "@/components/top-lists";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  path: "spotify",
  description: "What I've actually been listening to, pulled from Last.fm.",
});

export default function SpotifyPage() {
  return (
    <PageShell>
      <PageHeader title="Spotify Stats">
        What I&apos;ve actually been listening to, pulled from Last.fm (so no curating).
      </PageHeader>

      <NowPlaying />
      <TopArtists />
      <TopTracks />
    </PageShell>
  );
}
