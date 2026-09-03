"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Mail,
  Calendar,
  CheckSquare,
  Lightbulb,
  MessageSquare,
  Sparkles,
  UploadCloud,
  LogOut,
  UserCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/emails", label: "Email Assistant", icon: Mail },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/tasks", label: "Task Manager", icon: CheckSquare },
  { href: "/uploads", label: "File Uploads", icon: UploadCloud },
  { href: "/emails/compose", label: "Compose Mail", icon: Mail },
  { href: "/calendar/create", label: "Schedule Event", icon: Calendar },
  { href: "/insights", label: "Business Insights", icon: Lightbulb },
  { href: "/chat", label: "AI Chat", icon: MessageSquare },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const userName = session?.user?.name ?? "Business User";
  const userEmail = session?.user?.email ?? "workspace@aeson.ai";
  const initials = userName
    .split(/\s+/)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2) || "OP";
  const isLoading = status === "loading";
  const isSignedOut = status === "unauthenticated";

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-hairline bg-surface">
      <div className="flex items-center gap-3 border-b border-hairline px-6 py-5">
        <div className="sidebar-brand flex h-10 w-10 items-center justify-center rounded-sm bg-accent text-ink shadow-sm transition-transform transition-colors duration-200 ease-out active:scale-[0.98]">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-ink">aeson.ai</h1>
          <p className="text-xs text-muted">AI Operations Suite</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "nav-item flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-medium transition-transform transition-colors duration-200 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
                active ? "bg-ink text-surface shadow-sm" : "text-muted"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-hairline p-4">
        <div
          className={cn(
            "rounded-sm border p-3 transition-colors duration-200 ease-out",
            isLoading
              ? "border-dashed border-hairline bg-surface-2/80"
              : isSignedOut
                ? "border-hairline bg-surface-2 text-muted"
                : "border-hairline bg-surface-2"
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "profile-avatar flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-semibold text-ink transition-colors duration-200 ease-out",
                isLoading && "bg-accent/80"
              )}
            >
              {isLoading ? "" : initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">
                {isLoading ? "Loading profile..." : userName}
              </p>
              <p className="truncate text-xs text-muted">
                {isLoading
                  ? "Syncing workspace"
                  : isSignedOut
                    ? "Sign in to continue"
                    : userEmail}
              </p>
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            <Link
              href="/dashboard"
              className="sidebar-action inline-flex flex-1 items-center justify-center gap-2 rounded-sm border border-hairline bg-surface px-3 py-2 text-xs font-medium text-ink transition-transform transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface active:scale-[0.98]"
            >
              <UserCircle2 className="h-3.5 w-3.5" />
              Profile
            </Link>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/login" })}
              disabled={isLoading}
              className={cn(
                "sidebar-action inline-flex items-center justify-center gap-2 rounded-sm border px-3 py-2 text-xs font-medium transition-transform transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface active:scale-[0.98]",
                isLoading
                  ? "cursor-not-allowed border-hairline bg-surface-3 text-muted"
                  : "border-red-500/30 bg-red-500/10 text-red-200"
              )}
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
