"use client";

import { useState } from "react";
import { Sparkles, Mail, Inbox } from "lucide-react";
import { useCRM } from "@/lib/store";
import { categoryConfig, formatDateTime, cn } from "@/lib/utils";
import type { EmailCategory } from "@/lib/types";

const folders: { key: EmailCategory | "all"; label: string }[] = [
  { key: "all", label: "All Mail" },
  { key: "important", label: "Important" },
  { key: "follow-up", label: "Follow-up" },
  { key: "spam", label: "Spam" },
  { key: "newsletter", label: "Newsletter" },
  { key: "uncategorized", label: "Uncategorized" },
];

export function EmailAssistant() {
  const { emails, categorizeEmails, markEmailRead, moveEmailCategory } = useCRM();
  const [activeFolder, setActiveFolder] = useState<EmailCategory | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const filtered =
    activeFolder === "all"
      ? emails
      : emails.filter((e) => e.category === activeFolder);

  const selected = emails.find((e) => e.id === selectedId);
  const uncategorizedCount = emails.filter((e) => e.category === "uncategorized").length;

  const handleCategorize = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 800));
    categorizeEmails();
    setIsProcessing(false);
  };

  const handleSelect = (id: string) => {
    setSelectedId(id);
    markEmailRead(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Email Assistant</h1>
          <p className="mt-1 text-slate-400">
            AI reads and categorizes your emails into smart folders
          </p>
        </div>
        <button
          onClick={handleCategorize}
          disabled={isProcessing}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-60"
        >
          <Sparkles className={cn("h-4 w-4", isProcessing && "animate-pulse")} />
          {isProcessing ? "Analyzing emails..." : `AI Categorize (${uncategorizedCount} new)`}
        </button>
      </div>

      <div className="flex gap-6">
        <div className="w-48 shrink-0 space-y-1">
          {folders.map(({ key, label }) => {
            const count =
              key === "all"
                ? emails.length
                : emails.filter((e) => e.category === key).length;
            return (
              <button
                key={key}
                onClick={() => setActiveFolder(key)}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition",
                  activeFolder === key
                    ? "bg-indigo-600/20 text-indigo-300"
                    : "text-slate-400 hover:bg-slate-900"
                )}
              >
                <span className="flex items-center gap-2">
                  {key === "all" ? <Inbox className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
                  {label}
                </span>
                <span className="text-xs text-slate-500">{count}</span>
              </button>
            );
          })}
        </div>

        <div className="flex min-h-[520px] flex-1 overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50">
          <div className="w-1/2 border-r border-slate-800 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="p-6 text-sm text-slate-500">No emails in this folder</p>
            ) : (
              filtered.map((email) => (
                <button
                  key={email.id}
                  onClick={() => handleSelect(email.id)}
                  className={cn(
                    "w-full border-b border-slate-800 p-4 text-left transition hover:bg-slate-900",
                    selectedId === email.id && "bg-slate-900",
                    !email.read && "bg-indigo-950/20"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={cn("truncate text-sm", !email.read ? "font-semibold text-white" : "text-slate-300")}>
                      {email.from.split("<")[0].trim()}
                    </span>
                    <span className="shrink-0 text-xs text-slate-500">
                      {formatDateTime(email.receivedAt)}
                    </span>
                  </div>
                  <p className={cn("mt-1 truncate text-sm", !email.read ? "text-slate-200" : "text-slate-400")}>
                    {email.subject}
                  </p>
                  <span className={cn("mt-2 inline-block rounded-full px-2 py-0.5 text-xs", categoryConfig[email.category].color)}>
                    {categoryConfig[email.category].label}
                  </span>
                </button>
              ))
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {selected ? (
              <>
                <h2 className="text-lg font-semibold text-white">{selected.subject}</h2>
                <p className="mt-1 text-sm text-slate-400">{selected.from}</p>
                <div className="mt-4 flex gap-2">
                  {(Object.keys(categoryConfig) as EmailCategory[]).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => moveEmailCategory(selected.id, cat)}
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs transition",
                        selected.category === cat
                          ? categoryConfig[cat].color
                          : "bg-slate-800 text-slate-500 hover:text-slate-300"
                      )}
                    >
                      {categoryConfig[cat].label}
                    </button>
                  ))}
                </div>
                <pre className="mt-6 whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-300">
                  {selected.body}
                </pre>
              </>
            ) : (
              <div className="flex h-full items-center justify-center text-slate-500">
                Select an email to read
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
