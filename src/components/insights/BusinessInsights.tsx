"use client";

import { TrendingUp, DollarSign, Cog, Rocket } from "lucide-react";
import { Eyebrow } from "@/components/Eyebrow";
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
  low: "border-hairline bg-surface-2",
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
        "rounded-sm border p-5 transition-transform transition-colors duration-200 ease-out focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2 focus-within:ring-offset-surface active:scale-[0.99]",
        impactStyles[insight.impact]
      )}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-surface text-accent">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-ink">{insight.title}</h3>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-medium",
                insight.impact === "high"
                  ? "bg-red-500/15 text-red-400"
                  : insight.impact === "medium"
                    ? "bg-yellow-500/15 text-yellow-400"
                    : "bg-surface-3 text-muted"
              )}
            >
              {impactLabels[insight.impact]}
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted">{insight.description}</p>
          <span className="mt-3 inline-block rounded-full bg-surface px-2.5 py-0.5 text-xs capitalize text-muted">
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
      <div className="space-y-4">
        <Eyebrow>Insights</Eyebrow>
        <h1 className="display text-ink">Business Insights</h1>
        <p className="body max-w-2xl">
          AI-generated actionable advice based on your profit & loss data
        </p>
      </div>

      <div className="rounded-sm border border-accent/30 bg-accent/5 p-5">
        <p className="text-sm font-medium text-accent">AI Analysis Summary</p>
        <p className="mt-2 text-sm leading-relaxed text-ink">
          {stats.isCurrentlyLosing
            ? "Your business dipped into the red this month despite positive YTD performance. Focus on the high-impact recommendations below — particularly supplier renegotiation and client retention — to recover margins quickly."
            : "Your business maintains a healthy YTD profit margin. The recommendations below focus on optimizing costs, improving cash flow, and scaling high-margin services for sustained growth."}
        </p>
      </div>

      {highImpact.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-ink">Priority Actions ({highImpact.length})</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {highImpact.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-4 text-lg font-semibold text-ink">All Recommendations</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {insights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </section>
    </div>
  );
}
