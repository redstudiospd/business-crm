"use client";

import { useState } from "react";
import { Sparkles, Mail, Inbox } from "lucide-react";
import { Eyebrow } from "@/components/Eyebrow";
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
        <div className="space-y-4">
          <Eyebrow>Inbox</Eyebrow>
          <h1 className="display text-ink">Email Assistant</h1>
          <p className="body max-w-2xl">
            AI reads and categorizes your emails into smart folders
          </p>
        </div>
        <button
          onClick={handleCategorize}
          disabled={isProcessing}
          className="flex items-center gap-2 rounded-sm bg-accent px-4 py-2.5 text-sm font-medium text-ink transition-colors duration-200 ease-out disabled:opacity-60 active:scale-[0.98]"
        >
          <Sparkles className="h-4 w-4" />
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
                  "flex w-full items-center justify-between rounded-sm px-3 py-2 text-sm transition-colors transition-transform duration-200 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
                  activeFolder === key
                    ? "bg-accent/10 text-accent"
                    : "text-muted hover:bg-surface-2"
                )}
              >
                <span className="flex items-center gap-2">
                  {key === "all" ? <Inbox className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
                  {label}
                </span>
                <span className="text-xs text-muted">{count}</span>
              </button>
            );
          })}
        </div>

        <div className="flex min-h-[520px] flex-1 overflow-hidden rounded-sm border border-hairline bg-surface-2">
          <div className="w-1/2 overflow-y-auto border-r border-hairline">
            {filtered.length === 0 ? (
              <p className="p-6 text-sm text-muted">No emails in this folder</p>
            ) : (
              filtered.map((email) => (
                <button
                  key={email.id}
                  onClick={() => handleSelect(email.id)}
                  className={cn(
                    "w-full border-b border-hairline p-4 text-left transition-colors duration-200 ease-out hover:bg-surface",
                    selectedId === email.id && "bg-surface",
                    !email.read && "bg-accent/[0.04]"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={cn("truncate text-sm", !email.read ? "font-semibold text-ink" : "text-ink/80")}>
                      {email.from.split("<")[0].trim()}
                    </span>
                    <span className="shrink-0 text-xs text-muted">{formatDateTime(email.receivedAt)}</span>
                  </div>
                  <p className={cn("mt-1 truncate text-sm", !email.read ? "text-ink" : "text-muted")}>
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
                <h2 className="text-lg font-semibold text-ink">{selected.subject}</h2>
                <p className="mt-1 text-sm text-muted">{selected.from}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(Object.keys(categoryConfig) as EmailCategory[]).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => moveEmailCategory(selected.id, cat)}
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
                        selected.category === cat
                          ? categoryConfig[cat].color
                          : "bg-surface-3 text-muted hover:text-ink"
                      )}
                    >
                      {categoryConfig[cat].label}
                    </button>
                  ))}
                </div>
                <pre className="mt-6 whitespace-pre-wrap font-sans text-sm leading-relaxed text-ink">
                  {selected.body}
                </pre>
              </>
            ) : (
              <div className="flex h-full items-center justify-center text-muted">
                Select an email to read
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
