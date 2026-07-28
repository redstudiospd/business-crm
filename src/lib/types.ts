export type EmailCategory = "important" | "follow-up" | "spam" | "newsletter" | "uncategorized";

export type TaskPriority = "critical" | "high" | "medium" | "low";

export interface Email {
  id: string;
  from: string;
  subject: string;
  preview: string;
  body: string;
  receivedAt: string;
  category: EmailCategory;
  read: boolean;
  provider?: string;
  externalId?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate?: string;
  completed: boolean;
  sourceEmailId?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  start: string;
  end: string;
  type: "meeting" | "deadline" | "reminder";
  sourceEmailId?: string;
  provider?: string;
}

export interface MonthlyFinance {
  month: string;
  revenue: number;
  expenses: number;
}

export interface LossReason {
  id: string;
  title: string;
  impact: number;
  description: string;
}

export interface BusinessInsight {
  id: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  category: "revenue" | "cost" | "operations" | "growth";
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  emailCount: number;
  pendingTasks: number;
  upcomingEvents: number;
}
