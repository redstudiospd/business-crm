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
    <div className="space-y-8 rounded-3xl border border-hairline bg-surface-2 p-8">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Schedule Event</h1>
        <p className="mt-2 text-sm text-muted">
          Add a calendar event manually and keep your schedule aligned with business priorities.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm text-ink">
          Title
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            className="mt-2 w-full rounded-sm border border-hairline bg-surface px-4 py-3 text-ink outline-none transition-colors duration-200 ease-out focus:border-accent"
          />
        </label>
        <label className="block text-sm text-ink">
          Description
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
            rows={5}
            className="mt-2 w-full rounded-sm border border-hairline bg-surface px-4 py-3 text-ink outline-none transition-colors duration-200 ease-out focus:border-accent"
          />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm text-ink">
            Start
            <input
              type="datetime-local"
              value={start}
              onChange={(event) => setStart(event.target.value)}
              required
              className="mt-2 w-full rounded-sm border border-hairline bg-surface px-4 py-3 text-ink outline-none transition-colors duration-200 ease-out focus:border-accent"
            />
          </label>
          <label className="block text-sm text-ink">
            End
            <input
              type="datetime-local"
              value={end}
              onChange={(event) => setEnd(event.target.value)}
              required
              className="mt-2 w-full rounded-sm border border-hairline bg-surface px-4 py-3 text-ink outline-none transition-colors duration-200 ease-out focus:border-accent"
            />
          </label>
        </div>
        <button
          type="submit"
          className="rounded-sm bg-accent px-6 py-3 text-sm font-semibold text-ink transition-colors duration-200 ease-out hover:bg-accent-hover"
        >
          Create event
        </button>
      </form>
      {status ? <div className="rounded-sm bg-surface px-4 py-3 text-sm text-ink">{status}</div> : null}
    </div>
  );
}
