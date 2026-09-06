export type NowPlaying = {
  isPlaying: boolean;
  songName: string;
  artistName: string;
  songURL: string;
  imageURL: string;
};

export type TopArtist = { name: string; playcount: string; url: string };
export type TopTrack = { name: string; playcount: string; url: string; artist: string };

export type GithubStats = { stars: number; repos: number; followers: number };

export type Repo = {
  name: string;
  description: string;
  url: string;
  stars: number;
  forks: number;
};

export type LanyardUser = {
  username: string;
  displayName: string;
  avatarURL: string | null;
  status: "online" | "idle" | "dnd" | "offline";
};

export type Scrobbles = { url: string; playcount: number };

export type WakatimeStats = { text: string; total_seconds: number };

/** Every widget endpoint can answer "not set up yet" instead of failing. */
export type Unconfigured = { configured: false; reason: string };
export type Configured<T> = T & { configured?: true };
export type WidgetResponse<T> = Configured<T> | Unconfigured;

export function isUnconfigured<T>(d: WidgetResponse<T> | undefined): d is Unconfigured {
  return !!d && (d as Unconfigured).configured === false;
}
