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
import { useCRM, useDashboardStats } from "@/lib/store";
import { monthlyFinances, lossReasons } from "@/lib/data";
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
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-1 text-2xl font-bold text-white">{value}</p>
          {sub && (
            <p
              className={`mt-1 flex items-center gap-1 text-xs ${
                trend === "up"
                  ? "text-emerald-400"
                  : trend === "down"
                    ? "text-red-400"
                    : "text-slate-500"
              }`}
            >
              {trend === "up" && <TrendingUp className="h-3 w-3" />}
              {trend === "down" && <TrendingDown className="h-3 w-3" />}
              {sub}
            </p>
          )}
        </div>
        <div className="rounded-lg bg-indigo-600/20 p-2.5">
          <Icon className="h-5 w-5 text-indigo-400" />
        </div>
      </div>
    </div>
  );
}

export function DashboardView() {
  const stats = useDashboardStats();
  const { insights } = useCRM();

  const chartData = monthlyFinances.map((m) => ({
    ...m,
    profit: m.revenue - m.expenses,
  }));

  const topTips = insights.slice(0, 3);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-slate-400">
          Business analytics, profit & loss, and AI-powered recommendations
        </p>
      </div>

      {stats.isCurrentlyLosing && (
        <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
          <div>
            <p className="font-medium text-red-300">Business is losing money this month</p>
            <p className="mt-1 text-sm text-red-400/80">
              July expenses exceed revenue by{" "}
              {formatCurrency(
                monthlyFinances[monthlyFinances.length - 1].expenses -
                  monthlyFinances[monthlyFinances.length - 1].revenue
              )}
              . Review loss drivers below and check Business Insights for actionable tips.
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
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <h2 className="text-lg font-semibold text-white">Profit & Loss</h2>
          <p className="text-sm text-slate-400">Monthly revenue vs expenses</p>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    background: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => formatCurrency(Number(value))}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#6366f1" name="Revenue" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="#f43f5e" name="Expenses" radius={[4, 4, 0, 0]} />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#34d399"
                  strokeWidth={2}
                  name="Net Profit"
                  dot={{ fill: "#34d399" }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
            <h2 className="text-lg font-semibold text-white">Quick Stats</h2>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-400">
                  <Mail className="h-4 w-4" /> Emails today
                </span>
                <span className="font-medium text-white">{stats.emailCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-400">
                  <CheckSquare className="h-4 w-4" /> Open tasks
                </span>
                <span className="font-medium text-white">{stats.pendingTasks}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-400">
                  <Calendar className="h-4 w-4" /> Upcoming events
                </span>
                <span className="font-medium text-white">{stats.upcomingEvents}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
            <h2 className="text-lg font-semibold text-white">AI Tips</h2>
            <ul className="mt-4 space-y-3">
              {topTips.map((tip) => (
                <li key={tip.id} className="text-sm">
                  <p className="font-medium text-indigo-300">{tip.title}</p>
                  <p className="mt-0.5 text-slate-400 line-clamp-2">{tip.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
        <h2 className="text-lg font-semibold text-white">Why You&apos;re Losing Money</h2>
        <p className="text-sm text-slate-400">AI-identified loss drivers and their impact</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {lossReasons.map((reason) => (
            <div
              key={reason.id}
              className="rounded-lg border border-slate-800 bg-slate-950 p-4"
            >
              <div className="flex items-start justify-between">
                <h3 className="font-medium text-white">{reason.title}</h3>
                <span className="text-sm font-semibold text-red-400">
                  -{formatCurrency(reason.impact)}/mo
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-400">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
