import { site } from "@/lib/site";
import { cached, unconfigured, upstreamFailed } from "@/lib/widget";

type LanyardData = {
  discord_user: { username: string; global_name: string | null; avatar: string | null; id: string };
  discord_status: "online" | "idle" | "dnd" | "offline";
};

export async function GET() {
  if (!site.discordId) {
    return unconfigured("Set site.discordId and join discord.gg/lanyard to show presence.");
  }

  const res = await fetch(`https://api.lanyard.rest/v1/users/${site.discordId}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    // 404 here almost always means "not in the Lanyard server", not a bad ID.
    return res.status === 404
      ? unconfigured("Lanyard can't see this user — join discord.gg/lanyard first.")
      : upstreamFailed("Lanyard", res.status);
  }

  const { data } = (await res.json()) as { data: LanyardData };

  return cached(
    {
      username: data.discord_user.username,
      displayName: data.discord_user.global_name ?? data.discord_user.username,
      avatarURL: data.discord_user.avatar
        ? `https://cdn.discordapp.com/avatars/${data.discord_user.id}/${data.discord_user.avatar}.png?size=128`
        : null,
      status: data.discord_status,
    },
    60,
  );
}
