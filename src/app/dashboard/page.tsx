import { PageShell } from "@/components/page-shell";
import { PageHeader } from "@/components/card";
import { Discord } from "@/components/discord";
import { Stats } from "@/components/stats";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  path: "dashboard",
  description: "Numbers about me, live (my age included, to nine decimal places).",
});

export default function DashboardPage() {
  return (
    <PageShell>
      <PageHeader title="Dashboard">
        Numbers about me, live (my age included, to nine decimal places).
      </PageHeader>

      <Discord />
      <Stats />
    </PageShell>
  );
}
