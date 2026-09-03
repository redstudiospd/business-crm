"use client";

import { useMemo } from "react";
import { CheckCircle2, Circle, Calendar } from "lucide-react";
import { Eyebrow } from "@/components/Eyebrow";
import { useCRM } from "@/lib/store";
import { priorityConfig, formatDate, cn } from "@/lib/utils";
import type { TaskPriority } from "@/lib/types";

const priorityOrder: TaskPriority[] = ["critical", "high", "medium", "low"];

export function TaskManager() {
  const { tasks, toggleTaskComplete } = useCRM();

  const grouped = useMemo(() => {
    const open = tasks.filter((t) => !t.completed);
    const done = tasks.filter((t) => t.completed);
    const byPriority = priorityOrder.map((priority) => ({
      priority,
      tasks: open.filter((t) => t.priority === priority),
    }));
    return { byPriority, done };
  }, [tasks]);

  const totalOpen = tasks.filter((t) => !t.completed).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-4">
          <Eyebrow>Task flow</Eyebrow>
          <h1 className="display text-ink">Task Manager</h1>
          <p className="body max-w-2xl">
            Tasks sorted by priority — from critical to least important
          </p>
        </div>
        <div className="rounded-sm border border-hairline bg-surface-2 px-4 py-2 text-sm">
          <span className="text-muted">Open tasks: </span>
          <span className="font-semibold text-ink">{totalOpen}</span>
        </div>
      </div>

      <div className="space-y-8">
        {grouped.byPriority.map(({ priority, tasks: groupTasks }) => {
          const config = priorityConfig[priority];
          if (groupTasks.length === 0) return null;

          return (
            <section key={priority}>
              <div className="mb-4 flex items-center gap-3">
                <span className={cn("h-2.5 w-2.5 rounded-full", config.dot)} />
                <h2 className="text-lg font-semibold text-ink">{config.label}</h2>
                <span
                  className={cn(
                    "rounded-full border px-2.5 py-0.5 text-xs font-medium",
                    config.color
                  )}
                >
                  {groupTasks.length} task{groupTasks.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="space-y-3">
                {groupTasks.map((task) => (
                  <div
                    key={task.id}
                    className={cn(
                      "flex items-start gap-4 rounded-sm border border-hairline bg-surface-2 p-4 transition-transform transition-colors duration-200 ease-out focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2 focus-within:ring-offset-surface active:scale-[0.99]",
                      priority === "critical" && "border-red-500/20"
                    )}
                  >
                    <button
                      onClick={() => toggleTaskComplete(task.id)}
                      className="mt-0.5 shrink-0 text-muted transition-colors duration-200 ease-out hover:text-accent"
                    >
                      <Circle className="h-5 w-5" />
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-ink">{task.title}</p>
                      <p className="mt-1 text-sm text-muted">{task.description}</p>
                      {task.dueDate && (
                        <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
                          <Calendar className="h-3.5 w-3.5" />
                          Due {formatDate(task.dueDate)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {grouped.done.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-muted">Completed</h2>
          <div className="space-y-2">
            {grouped.done.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-4 rounded-sm border border-hairline bg-surface-2 p-3 opacity-60"
              >
                <button
                  onClick={() => toggleTaskComplete(task.id)}
                  className="shrink-0 text-emerald-500"
                >
                  <CheckCircle2 className="h-5 w-5" />
                </button>
                <p className="text-sm text-muted line-through">{task.title}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
