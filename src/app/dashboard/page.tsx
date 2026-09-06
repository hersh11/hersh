import { PageShell } from "@/components/page-shell";
import { PageHeader } from "@/components/card";
import { Discord } from "@/components/discord";
import { Stats } from "@/components/stats";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  path: "dashboard",
  description: "Random stats and stuff related to me.",
  emoji: "🏷️",
});

export default function DashboardPage() {
  return (
    <PageShell>
      <PageHeader title="Dashboard">Random stats and stuff related to me.</PageHeader>

      <Discord />
      <Stats />
    </PageShell>
  );
}
