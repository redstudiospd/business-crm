"use client";

import { useState } from "react";

export default function ComposePage() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("Saving draft...");
    const response = await fetch("/api/compose", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, subject, body }),
    });
    if (response.ok) {
      setStatus("Draft saved successfully.");
      setTo("");
      setSubject("");
      setBody("");
    } else {
      setStatus("Failed to save draft.");
    }
  };

  return (
    <div className="space-y-8 rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Compose Mail</h1>
        <p className="mt-2 text-sm text-slate-400">
          Draft and send messages as part of your AI-powered business workflows.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
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
        <button
          type="submit"
          className="rounded-2xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-400"
        >
          Save draft
        </button>
      </form>
      {status ? (
        <div className="rounded-2xl bg-slate-800 px-4 py-3 text-sm text-slate-200">
          {status}
        </div>
      ) : null}
    </div>
  );
}
