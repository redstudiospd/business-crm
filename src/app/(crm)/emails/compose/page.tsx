"use client";

import { useState } from "react";

export default function ComposePage() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAction = async (action: "draft" | "send") => {
    setLoading(true);
    setStatus(action === "send" ? "Sending..." : "Saving draft...");

    const response = await fetch("/api/compose", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, subject, body, action }),
    });

    const result = await response.json();

    if (response.ok) {
      setStatus(
        action === "send"
          ? "Email sent successfully."
          : "Draft saved to Gmail."
      );
      setTo("");
      setSubject("");
      setBody("");
    } else {
      setStatus(result.error ?? "Something went wrong.");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8 rounded-3xl border border-hairline bg-surface-2 p-8">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Compose Mail</h1>
        <p className="mt-2 text-sm text-muted">
          Draft and send messages as part of your AI-powered business workflows.
        </p>
      </div>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        <label className="block text-sm text-ink">
          To
          <input
            value={to}
            onChange={(event) => setTo(event.target.value)}
            required
            className="mt-2 w-full rounded-sm border border-hairline bg-surface px-4 py-3 text-ink outline-none transition-colors duration-200 ease-out focus:border-accent"
          />
        </label>
        <label className="block text-sm text-ink">
          Subject
          <input
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            required
            className="mt-2 w-full rounded-sm border border-hairline bg-surface px-4 py-3 text-ink outline-none transition-colors duration-200 ease-out focus:border-accent"
          />
        </label>
        <label className="block text-sm text-ink">
          Body
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            required
            rows={10}
            className="mt-2 w-full rounded-sm border border-hairline bg-surface px-4 py-3 text-ink outline-none transition-colors duration-200 ease-out focus:border-accent"
          />
        </label>
        <div className="flex gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleAction("draft")}
            className="rounded-sm border border-hairline bg-surface px-6 py-3 text-sm font-semibold text-ink transition-colors duration-200 ease-out hover:bg-surface-3 disabled:opacity-50"
          >
            Save as draft
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => handleAction("send")}
            className="rounded-sm bg-accent px-6 py-3 text-sm font-semibold text-ink transition-colors duration-200 ease-out hover:bg-accent-hover disabled:opacity-50"
          >
            Send email
          </button>
        </div>
      </form>
      {status ? (
        <div className="rounded-sm bg-surface px-4 py-3 text-sm text-ink">{status}</div>
      ) : null}
    </div>
  );
}