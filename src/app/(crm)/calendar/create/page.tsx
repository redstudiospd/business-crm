"use client";

import { useState } from "react";

export default function CreateEventPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("Scheduling event...");
    const response = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, start, end }),
    });
    if (response.ok) {
      setStatus("Calendar event created.");
      setTitle("");
      setDescription("");
      setStart("");
      setEnd("");
    } else {
      setStatus("Unable to create event.");
    }
  };

  return (
    <div className="space-y-8 rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Schedule Event</h1>
        <p className="mt-2 text-sm text-slate-400">
          Add a calendar event manually and keep your schedule aligned with business priorities.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm text-slate-200">
          Title
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
          />
        </label>
        <label className="block text-sm text-slate-200">
          Description
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
            rows={5}
            className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
          />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm text-slate-200">
            Start
            <input
              type="datetime-local"
              value={start}
              onChange={(event) => setStart(event.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
            />
          </label>
          <label className="block text-sm text-slate-200">
            End
            <input
              type="datetime-local"
              value={end}
              onChange={(event) => setEnd(event.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
            />
          </label>
        </div>
        <button
          type="submit"
          className="rounded-2xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-400"
        >
          Create event
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
