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
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg shadow-slate-950/20">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-indigo-300">
              Welcome back
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
              {getGreeting()}, {displayName}
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-400">
              Your operations workspace is ready. Review revenue signals, follow-ups, and the
              next actions that need attention across the business.
            </p>
          </div>
          <div className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-200">
            Live workspace
          </div>
        </div>
      </div>

      <DashboardView />
    </div>
  );
}
