"use client";

import { Sidebar } from "./Sidebar";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { CRMProvider } from "@/lib/store";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <CRMProvider>
      <div className="flex min-h-screen bg-surface text-ink">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-surface">
          <header className="sticky top-0 z-10 border-b border-hairline bg-surface/90 px-8 py-4 backdrop-blur-xl">
            <div className="flex items-center justify-end">
              <ThemeSwitcher />
            </div>
          </header>
          <div className="mx-auto max-w-7xl p-6 md:p-8">{children}</div>
        </main>
      </div>
    </CRMProvider>
  );
}
