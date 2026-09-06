import { site } from "./site";

const BASE = "https://ws.audioscrobbler.com/2.0/";

/**
 * asrvd's Spotify page reads Last.fm, not the Spotify API — Last.fm scrobbles
 * whatever you play and needs only a read-only key, no OAuth dance.
 * Connect Spotify at last.fm/settings/applications for this to have data.
 */
export function lastfmReady() {
  return Boolean(process.env.LASTFM_API_KEY && site.lastfm);
}

type Method = "user.getrecenttracks" | "user.gettopartists" | "user.gettoptracks" | "user.getinfo";

export async function lastfm(method: Method, params: Record<string, string> = {}, revalidate = 60) {
  const url = new URL(BASE);
  url.searchParams.set("method", method);
  url.searchParams.set("user", site.lastfm);
  url.searchParams.set("api_key", process.env.LASTFM_API_KEY as string);
  url.searchParams.set("format", "json");
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  return fetch(url, { next: { revalidate } });
}

/** Last.fm returns four sizes; index 3 is the largest. */
export function largestImage(images: { "#text": string }[] | undefined) {
  return images?.[3]?.["#text"] || images?.at(-1)?.["#text"] || "";
}
