import { cached, unconfigured, upstreamFailed } from "@/lib/widget";

export async function GET() {
  const key = process.env.WAKATIME_API_KEY;
  if (!key) return unconfigured("Set WAKATIME_API_KEY to show total coding hours.");

  const res = await fetch("https://wakatime.com/api/v1/users/current/all_time_since_today", {
    // Wakatime wants the raw API key as the Basic username, base64 encoded.
    headers: { Authorization: `Basic ${Buffer.from(key).toString("base64")}` },
    next: { revalidate: 86400 },
  });
  if (!res.ok) return upstreamFailed("Wakatime", res.status);

  const json = await res.json();
  return cached({ text: json?.data?.text ?? "", total_seconds: json?.data?.total_seconds ?? 0 }, 86400);
}
