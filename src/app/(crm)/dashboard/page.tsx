import { Eyebrow } from "@/components/Eyebrow";
import { DashboardView } from "@/components/dashboard/DashboardView";
import { auth } from "@/lib/auth";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default async function DashboardPage() {
  const session = await auth();
  const displayName = session?.user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="space-y-6">
      <div className="rounded-sm border border-hairline bg-surface-2 p-6 shadow-lg shadow-black/10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Eyebrow>Welcome back</Eyebrow>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">
              {getGreeting()}, {displayName}
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-muted">
              Your operations workspace is ready. Review revenue signals, follow-ups, and the
              next actions that need attention across the business.
            </p>
          </div>
          <div className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent">
            Live workspace
          </div>
        </div>
      </div>

      <DashboardView />
    </div>
  );
}
