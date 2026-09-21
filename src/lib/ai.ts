import type { Email, EmailCategory, BusinessInsight, MonthlyFinance } from "./types";
import { lossReasons } from "./data";

const spamPatterns = [
  /won.*\$|claim now|lottery|click here|90% off|limited time/i,
  /unsubscribe.*bottom|bank details|grand prize/i,
];

const newsletterPatterns = [
  /newsletter|weekly digest|issue #|industry trends|monthly update/i,
];

const importantPatterns = [
  /contract|renewal|invoice|overdue|deadline|critical|outage|action required|payment due|tax/i,
  /interested in|demo|proposal|partnership/i,
];

const followUpPatterns = [
  /follow.?up|following up|reminder|schedule|meeting|call|sync|available/i,
];

export function categorizeEmail(email: Email): EmailCategory {
  const text = `${email.subject} ${email.preview} ${email.body}`.toLowerCase();

  if (spamPatterns.some((p) => p.test(text))) return "spam";
  if (newsletterPatterns.some((p) => p.test(text))) return "newsletter";
  if (importantPatterns.some((p) => p.test(text))) return "important";
  if (followUpPatterns.some((p) => p.test(text))) return "follow-up";
  return "uncategorized";
}

export function categorizeAllEmails(emails: Email[]): Email[] {
  return emails.map((email) => ({
    ...email,
    category: email.category === "uncategorized" ? categorizeEmail(email) : email.category,
  }));
}

export function generateInsights(finances: MonthlyFinance[] = []): BusinessInsight[] {
  if (finances.length === 0) return [];

  const totalRevenue = finances.reduce((s, m) => s + m.revenue, 0);
  const totalExpenses = finances.reduce((s, m) => s + m.expenses, 0);
  const netProfit = totalRevenue - totalExpenses;
  const latest = finances[finances.length - 1];
  const isLosing = latest && latest.revenue < latest.expenses;

  const insights: BusinessInsight[] = [];

  if (isLosing) {
    insights.push({
      id: "i1",
      title: "Address July revenue dip immediately",
      description: `July shows a loss of $${(latest.expenses - latest.revenue).toLocaleString()}. Focus on closing pending deals like the Acme Corp renewal and accelerating invoice collections.`,
      impact: "high",
      category: "revenue",
    });
  }

  insights.push({
    id: "i2",
    title: "Renegotiate supplier contracts",
    description: `Supplier costs account for $${lossReasons[0].impact.toLocaleString()} in margin erosion. Request volume discounts or explore alternative vendors.`,
    impact: "high",
    category: "cost",
  });

  insights.push({
    id: "i3",
    title: "Improve client retention program",
    description: `Customer churn cost an estimated $${lossReasons[1].impact.toLocaleString()}. Schedule quarterly check-ins with top accounts and implement an early warning system for at-risk clients.`,
    impact: "high",
    category: "growth",
  });

  insights.push({
    id: "i4",
    title: "Optimize marketing ROI",
    description: `Ad spend inefficiency is costing ~$${lossReasons[2].impact.toLocaleString()}/month. Pause underperforming channels and A/B test landing pages to improve the 2.1% conversion rate.`,
    impact: "medium",
    category: "operations",
  });

  insights.push({
    id: "i5",
    title: "Automate invoicing workflow",
    description: `Delayed invoicing tied up ~$${lossReasons[3].impact.toLocaleString()} in cash flow. Send invoices within 24 hours of delivery and enable automated payment reminders.`,
    impact: "medium",
    category: "operations",
  });

  if (netProfit > 0) {
    insights.push({
      id: "i6",
      title: "Reinvest surplus into high-margin services",
      description: `YTD net profit is $${netProfit.toLocaleString()} (${((netProfit / totalRevenue) * 100).toFixed(1)}% margin). Consider expanding consulting or premium support tiers.`,
      impact: "medium",
      category: "growth",
    });
  }

  return insights;
}

export function getDashboardSummary(finances: MonthlyFinance[] = []) {
  if (finances.length === 0) {
    return {
      totalRevenue: 0,
      totalExpenses: 0,
      netProfit: 0,
      profitMargin: 0,
      isCurrentlyLosing: false,
    };
  }

  const totalRevenue = finances.reduce((s, m) => s + m.revenue, 0);
  const totalExpenses = finances.reduce((s, m) => s + m.expenses, 0);
  const netProfit = totalRevenue - totalExpenses;
  const latest = finances[finances.length - 1];

  return {
    totalRevenue,
    totalExpenses,
    netProfit,
    profitMargin: totalRevenue === 0 ? 0 : (netProfit / totalRevenue) * 100,
    isCurrentlyLosing: latest ? latest.revenue < latest.expenses : false,
  };
}

export function generateChatResponse(
  message: string,
  context: {
    stats: ReturnType<typeof getDashboardSummary>;
    pendingTasks: number;
    unreadEmails: number;
    upcomingEvents: number;
  }
): string {
  const lower = message.toLowerCase();

  if (lower.includes("profit") || lower.includes("loss") || lower.includes("p&l") || lower.includes("revenue")) {
    const { totalRevenue, totalExpenses, netProfit, profitMargin, isCurrentlyLosing } = context.stats;
    if (isCurrentlyLosing) {
      return `Your business is currently running at a loss this month. YTD revenue is $${totalRevenue.toLocaleString()} against $${totalExpenses.toLocaleString()} in expenses, giving a net profit of $${netProfit.toLocaleString()} (${profitMargin.toFixed(1)}% margin). The main drivers are rising supplier costs and customer churn. Check the Dashboard and Business Insights tabs for specific recommendations.`;
    }
    return `YTD revenue is $${totalRevenue.toLocaleString()} with expenses at $${totalExpenses.toLocaleString()}, yielding a net profit of $${netProfit.toLocaleString()} (${profitMargin.toFixed(1)}% margin). July dipped slightly — focus on closing the Acme Corp renewal to recover.`;
  }

  if (lower.includes("task") || lower.includes("priority") || lower.includes("todo")) {
    return `You have ${context.pendingTasks} pending tasks. Critical items include the Acme Corp contract renewal and the overdue vendor invoice (#8842). Visit the Task Manager to see everything sorted by priority.`;
  }

  if (lower.includes("email") || lower.includes("inbox")) {
    return `You have ${context.unreadEmails} unread emails. Use the Email Assistant to auto-categorize them into Important, Follow-up, Spam, and Newsletter folders. I recommend running AI categorization to clear your inbox quickly.`;
  }

  if (lower.includes("calendar") || lower.includes("meeting") || lower.includes("schedule")) {
    return `You have ${context.upcomingEvents} upcoming events. Key dates: Acme renewal call (Jul 29), Q2 tax deadline (Jul 31), and the Client.io deliverable (Aug 1). The calendar auto-populates from analyzed emails.`;
  }

  if (lower.includes("improve") || lower.includes("tip") || lower.includes("advice") || lower.includes("insight")) {
    return `Top recommendations: (1) Renegotiate supplier contracts to cut the $4,200 margin hit, (2) Launch a client retention program to reduce churn, (3) Optimize ad spend by pausing low-converting campaigns, and (4) Automate invoicing to improve cash flow. See Business Insights for full details.`;
  }

  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
    return `Hello! I'm your CRM AI assistant. I can help you understand your business performance, manage tasks, emails, and calendar. Try asking about profits, pending tasks, or how to improve the business.`;
  }

  return `I can help with business analytics, email management, tasks, calendar, and growth advice. Try asking: "Why are we losing money?", "What are my critical tasks?", or "How can I improve the business?"`;
}

export async function generateChatResponseWithAI(
  message: string,
  context: ReturnType<typeof getDashboardSummary>
): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a helpful CRM business assistant. Business context: Revenue $${context.totalRevenue}, Expenses $${context.totalExpenses}, Net profit $${context.netProfit}, Margin ${context.profitMargin.toFixed(1)}%. Currently losing money this month: ${context.isCurrentlyLosing}. Be concise and actionable.`,
          },
          { role: "user", content: message },
        ],
        max_tokens: 400,
      }),
    });

    if (!response.ok) return null;
    const data = await response.json();
    return data.choices?.[0]?.message?.content ?? null;
  } catch {
    return null;
  }
}
