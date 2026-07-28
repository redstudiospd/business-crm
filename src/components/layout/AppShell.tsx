"use client";

import { Sidebar } from "./Sidebar";
import { CRMProvider } from "@/lib/store";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <CRMProvider>
      <div className="flex min-h-screen bg-slate-950">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl p-8">{children}</div>
        </main>
      </div>
    </CRMProvider>
  );
}
