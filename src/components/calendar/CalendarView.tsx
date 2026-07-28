"use client";

import { useMemo } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  parseISO,
} from "date-fns";
import { Calendar, Clock, Users, AlertCircle } from "lucide-react";
import { useCRM } from "@/lib/store";
import { cn, formatDateTime } from "@/lib/utils";
import type { CalendarEvent } from "@/lib/types";

const typeIcons = {
  meeting: Users,
  deadline: AlertCircle,
  reminder: Clock,
};

const typeColors = {
  meeting: "border-indigo-500/40 bg-indigo-500/10 text-indigo-300",
  deadline: "border-red-500/40 bg-red-500/10 text-red-300",
  reminder: "border-yellow-500/40 bg-yellow-500/10 text-yellow-300",
};

export function CalendarView() {
  const { events } = useCRM();
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const upcoming = useMemo(
    () =>
      [...events]
        .filter((e) => new Date(e.start) >= today)
        .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()),
    [events]
  );

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    events.forEach((event) => {
      const key = format(parseISO(event.start), "yyyy-MM-dd");
      map.set(key, [...(map.get(key) ?? []), event]);
    });
    return map;
  }, [events]);

  const startPad = monthStart.getDay();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Calendar & Scheduling</h1>
        <p className="mt-1 text-slate-400">
          Deadlines and meetings auto-scheduled from email analysis
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              {format(today, "MMMM yyyy")}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Calendar className="h-4 w-4" />
              AI-synced from emails
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-500">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="py-2">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: startPad }).map((_, i) => (
              <div key={`pad-${i}`} className="aspect-square" />
            ))}
            {days.map((day) => {
              const key = format(day, "yyyy-MM-dd");
              const dayEvents = eventsByDay.get(key) ?? [];
              return (
                <div
                  key={key}
                  className={cn(
                    "aspect-square rounded-lg border p-1 transition",
                    isSameMonth(day, today) ? "border-slate-800" : "border-transparent opacity-40",
                    isToday(day) && "border-indigo-500/50 bg-indigo-500/10"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full text-xs",
                      isToday(day) ? "bg-indigo-600 font-bold text-white" : "text-slate-400"
                    )}
                  >
                    {format(day, "d")}
                  </span>
                  <div className="mt-0.5 space-y-0.5">
                    {dayEvents.slice(0, 2).map((e) => (
                      <div
                        key={e.id}
                        className={cn(
                          "truncate rounded px-1 text-[10px] leading-tight",
                          typeColors[e.type]
                        )}
                      >
                        {e.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-[10px] text-slate-500">+{dayEvents.length - 2} more</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <h2 className="text-lg font-semibold text-white">Upcoming Events</h2>
          <p className="text-sm text-slate-400">Auto-created from email analysis</p>
          <div className="mt-4 space-y-3">
            {upcoming.length === 0 ? (
              <p className="text-sm text-slate-500">No upcoming events</p>
            ) : (
              upcoming.map((event) => {
                const Icon = typeIcons[event.type];
                return (
                  <div
                    key={event.id}
                    className={cn(
                      "rounded-lg border p-3",
                      typeColors[event.type]
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
                      <div>
                        <p className="text-sm font-medium">{event.title}</p>
                        <p className="mt-0.5 text-xs opacity-80">
                          {formatDateTime(event.start)}
                        </p>
                        <p className="mt-1 text-xs opacity-70">{event.description}</p>
                        {event.sourceEmailId && (
                          <p className="mt-1 text-[10px] uppercase tracking-wide opacity-60">
                            From email
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
