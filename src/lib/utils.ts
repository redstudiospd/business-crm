import clsx from "clsx";

export function cn(...inputs: (string | boolean | undefined | null)[]) {
  return clsx(inputs);
}

export const priorityConfig = {
  critical: {
    label: "Do Right Now",
    color: "bg-red-500/15 text-red-400 border-red-500/30",
    dot: "bg-red-500",
    order: 0,
  },
  high: {
    label: "High Priority",
    color: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    dot: "bg-orange-500",
    order: 1,
  },
  medium: {
    label: "Medium Priority",
    color: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    dot: "bg-yellow-500",
    order: 2,
  },
  low: {
    label: "Least Priority",
    color: "bg-slate-500/15 text-slate-400 border-slate-500/30",
    dot: "bg-slate-500",
    order: 3,
  },
} as const;

export const categoryConfig = {
  important: { label: "Important", color: "bg-emerald-500/15 text-emerald-400" },
  "follow-up": { label: "Follow-up", color: "bg-blue-500/15 text-blue-400" },
  spam: { label: "Spam", color: "bg-red-500/15 text-red-400" },
  newsletter: { label: "Newsletter", color: "bg-purple-500/15 text-purple-400" },
  uncategorized: { label: "Uncategorized", color: "bg-slate-500/15 text-slate-400" },
} as const;

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
