"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Mail,
  Calendar,
  CheckSquare,
  Lightbulb,
  MessageSquare,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
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

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-950">
      <div className="flex items-center gap-3 border-b border-slate-800 px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-white">OperaOPS</h1>
          <p className="text-xs text-slate-500">AI Operations Suite</p>
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
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-indigo-600/20 text-indigo-300"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 p-4">
        <div className="rounded-lg bg-slate-900 p-3">
          <p className="text-xs font-medium text-slate-300">AI Assistant Active</p>
          <p className="mt-1 text-xs text-slate-500">
            Emails, scheduling, and insights powered by AI
          </p>
        </div>
      </div>
    </aside>
  );
}
