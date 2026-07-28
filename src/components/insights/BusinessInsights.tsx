"use client";

import { TrendingUp, DollarSign, Cog, Rocket } from "lucide-react";
import { useCRM } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { BusinessInsight } from "@/lib/types";

const categoryIcons = {
  revenue: DollarSign,
  cost: TrendingUp,
  operations: Cog,
  growth: Rocket,
};

const impactStyles = {
  high: "border-red-500/30 bg-red-500/5",
  medium: "border-yellow-500/30 bg-yellow-500/5",
  low: "border-slate-700 bg-slate-900/30",
};

const impactLabels = {
  high: "High Impact",
  medium: "Medium Impact",
  low: "Low Impact",
};

function InsightCard({ insight }: { insight: BusinessInsight }) {
  const Icon = categoryIcons[insight.category];

  return (
    <div
      className={cn(
        "rounded-xl border p-5 transition hover:border-slate-700",
        impactStyles[insight.impact]
      )}
    >
      <div className="flex items-start gap-4">
        <div className="rounded-lg bg-indigo-600/20 p-2.5">
          <Icon className="h-5 w-5 text-indigo-400" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-white">{insight.title}</h3>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-medium",
                insight.impact === "high"
                  ? "bg-red-500/15 text-red-400"
                  : insight.impact === "medium"
                    ? "bg-yellow-500/15 text-yellow-400"
                    : "bg-slate-700 text-slate-400"
              )}
            >
              {impactLabels[insight.impact]}
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            {insight.description}
          </p>
          <span className="mt-3 inline-block rounded-full bg-slate-800 px-2.5 py-0.5 text-xs capitalize text-slate-400">
            {insight.category}
          </span>
        </div>
      </div>
    </div>
  );
}

export function BusinessInsightsView() {
  const { insights, stats } = useCRM();

  const highImpact = insights.filter((i) => i.impact === "high");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Business Insights</h1>
        <p className="mt-1 text-slate-400">
          AI-generated actionable advice based on your profit & loss data
        </p>
      </div>

      <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-5">
        <p className="text-sm font-medium text-indigo-300">AI Analysis Summary</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">
          {stats.isCurrentlyLosing
            ? "Your business dipped into the red this month despite positive YTD performance. Focus on the high-impact recommendations below — particularly supplier renegotiation and client retention — to recover margins quickly."
            : "Your business maintains a healthy YTD profit margin. The recommendations below focus on optimizing costs, improving cash flow, and scaling high-margin services for sustained growth."}
        </p>
      </div>

      {highImpact.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-white">
            Priority Actions ({highImpact.length})
          </h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {highImpact.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-4 text-lg font-semibold text-white">All Recommendations</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {insights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </section>
    </div>
  );
}
