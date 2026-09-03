"use client";

import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Line,
  ComposedChart,
} from "recharts";
import {
  TrendingDown,
  TrendingUp,
  DollarSign,
  Mail,
  CheckSquare,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { Eyebrow } from "@/components/Eyebrow";
import { useCRM, useDashboardStats } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  trend,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  trend?: "up" | "down" | "neutral";
}) {
  return (
    <div className="stat-card rounded-sm border border-hairline bg-surface-2 p-6 transition-transform transition-colors duration-200 ease-out focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2 focus-within:ring-offset-surface active:scale-[0.99]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.18em] text-muted">{label}</p>
          <p className="mt-3 text-2xl font-bold text-ink">{value}</p>
          {sub && (
            <p
              className={`mt-2 flex items-center gap-1 text-xs ${
                trend === "up"
                  ? "text-accent"
                  : trend === "down"
                    ? "text-red-400"
                    : "text-muted"
              }`}
            >
              {trend === "up" && <TrendingUp className="h-3 w-3" />}
              {trend === "down" && <TrendingDown className="h-3 w-3" />}
              {sub}
            </p>
          )}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-muted">
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

export function DashboardView() {
  const stats = useDashboardStats();
  const { finances, insights } = useCRM();

  const chartData = finances.map((m) => ({
    ...m,
    profit: m.revenue - m.expenses,
  }));

  const topTips = insights.slice(0, 3);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Eyebrow>Financial pulse</Eyebrow>
        <h1 className="display text-ink">Dashboard</h1>
        <p className="body max-w-2xl">
          Business analytics, profit & loss, and AI-powered recommendations
        </p>
      </div>

      {stats.isCurrentlyLosing && finances.length > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
          <div>
            <p className="font-medium text-red-300">Business is losing money this month</p>
            <p className="mt-1 text-sm text-red-400/80">
              Latest month expenses exceed revenue by{" "}
              {formatCurrency(
                (finances[finances.length - 1]?.expenses ?? 0) -
                  (finances[finances.length - 1]?.revenue ?? 0)
              )}
              . Review the recommendations below for actionable tips.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="YTD Revenue"
          value={formatCurrency(stats.totalRevenue)}
          sub="+8.2% vs last period"
          icon={DollarSign}
          trend="up"
        />
        <StatCard
          label="YTD Expenses"
          value={formatCurrency(stats.totalExpenses)}
          sub="+5.1% vs last period"
          icon={TrendingDown}
          trend="down"
        />
        <StatCard
          label="Net Profit"
          value={formatCurrency(stats.netProfit)}
          sub={`${stats.profitMargin.toFixed(1)}% margin`}
          icon={stats.netProfit >= 0 ? TrendingUp : TrendingDown}
          trend={stats.netProfit >= 0 ? "up" : "down"}
        />
        <StatCard
          label="Pending Tasks"
          value={String(stats.pendingTasks)}
          sub={`${stats.unreadEmails} unread emails`}
          icon={CheckSquare}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-sm border border-hairline bg-surface-2 p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-ink">Profit & Loss</h2>
              <p className="mt-1 text-sm text-muted">Monthly revenue vs expenses</p>
            </div>
          </div>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d9d4cd" />
                <XAxis dataKey="month" stroke="#6b6b64" fontSize={12} />
                <YAxis stroke="#6b6b64" fontSize={12} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    background: "#ffffff",
                    border: "1px solid #dedad2",
                    borderRadius: "4px",
                    color: "#1a1a1a",
                  }}
                  formatter={(value) => formatCurrency(Number(value))}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#e9553d" name="Revenue" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="#d4d0c8" name="Expenses" radius={[4, 4, 0, 0]} />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#e9553d"
                  strokeWidth={2}
                  name="Net Profit"
                  dot={{ fill: "#e9553d" }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-sm border border-hairline bg-surface-2 p-6">
            <h2 className="text-lg font-semibold text-ink">Quick Stats</h2>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted">
                  <Mail className="h-4 w-4" /> Emails today
                </span>
                <span className="font-medium text-ink">{stats.emailCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted">
                  <CheckSquare className="h-4 w-4" /> Open tasks
                </span>
                <span className="font-medium text-ink">{stats.pendingTasks}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted">
                  <Calendar className="h-4 w-4" /> Upcoming events
                </span>
                <span className="font-medium text-ink">{stats.upcomingEvents}</span>
              </div>
            </div>
          </div>

          <div className="rounded-sm border border-hairline bg-surface-2 p-6">
            <h2 className="text-lg font-semibold text-ink">AI Tips</h2>
            <ul className="mt-4 space-y-3">
              {topTips.map((tip) => (
                <li key={tip.id} className="text-sm">
                  <p className="font-medium text-accent">{tip.title}</p>
                  <p className="mt-1 text-muted line-clamp-2">{tip.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {topTips.length > 0 && (
        <div className="rounded-sm border border-hairline bg-surface-2 p-6">
          <h2 className="text-lg font-semibold text-ink">Recommended Actions</h2>
          <p className="mt-1 text-sm text-muted">AI-generated priorities for your current data.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {topTips.map((tip) => (
              <div
                key={tip.id}
                className="rounded-sm border border-hairline bg-surface p-4 transition-transform transition-colors duration-200 ease-out focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2 focus-within:ring-offset-surface active:scale-[0.99]"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-medium text-ink">{tip.title}</h3>
                  <span className="rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-accent">
                    {tip.impact}
                  </span>
                </div>
                <p className="mt-3 text-sm text-muted">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
