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
    <div className="space-y-8 rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Compose Mail</h1>
        <p className="mt-2 text-sm text-slate-400">
          Draft and send messages as part of your AI-powered business workflows.
        </p>
      </div>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="space-y-4"
      >
        <label className="block text-sm text-slate-200">
          To
          <input
            value={to}
            onChange={(event) => setTo(event.target.value)}
            required
            className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
          />
        </label>
        <label className="block text-sm text-slate-200">
          Subject
          <input
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            required
            className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
          />
        </label>
        <label className="block text-sm text-slate-200">
          Body
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            required
            rows={10}
            className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
          />
        </label>
        <div className="flex gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleAction("draft")}
            className="rounded-2xl border border-slate-700 bg-slate-800 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
          >
            Save as draft
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => handleAction("send")}
            className="rounded-2xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-400 disabled:opacity-50"
          >
            Send email
          </button>
        </div>
      </form>
      {status ? (
        <div className="rounded-2xl bg-slate-800 px-4 py-3 text-sm text-slate-200">
          {status}
        </div>
      ) : null}
    </div>
  );
}