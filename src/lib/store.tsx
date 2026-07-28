"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  initialEmails,
  initialEvents,
  initialTasks,
} from "./data";
import {
  categorizeAllEmails,
  generateInsights,
  getDashboardSummary,
} from "./ai";
import type {
  CalendarEvent,
  ChatMessage,
  Email,
  Task,
} from "./types";

interface CRMContextValue {
  emails: Email[];
  tasks: Task[];
  events: CalendarEvent[];
  chatMessages: ChatMessage[];
  insights: ReturnType<typeof generateInsights>;
  stats: ReturnType<typeof getDashboardSummary>;
  categorizeEmails: () => void;
  toggleTaskComplete: (id: string) => void;
  markEmailRead: (id: string) => void;
  moveEmailCategory: (id: string, category: Email["category"]) => void;
  addChatMessage: (role: "user" | "assistant", content: string) => void;
  addEvent: (event: Omit<CalendarEvent, "id">) => void;
}

const CRMContext = createContext<CRMContextValue | null>(null);

export function CRMProvider({ children }: { children: ReactNode }) {
  const [emails, setEmails] = useState<Email[]>(initialEmails);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Welcome to your Business CRM! I can answer questions about your finances, tasks, emails, and calendar. What would you like to know?",
      timestamp: new Date().toISOString(),
    },
  ]);

  const insights = useMemo(() => generateInsights(), []);
  const stats = useMemo(() => getDashboardSummary(), []);

  const categorizeEmails = useCallback(() => {
    setEmails((prev) => categorizeAllEmails(prev));
  }, []);

  const toggleTaskComplete = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }, []);

  const markEmailRead = useCallback((id: string) => {
    setEmails((prev) =>
      prev.map((e) => (e.id === id ? { ...e, read: true } : e))
    );
  }, []);

  const moveEmailCategory = useCallback(
    (id: string, category: Email["category"]) => {
      setEmails((prev) =>
        prev.map((e) => (e.id === id ? { ...e, category } : e))
      );
    },
    []
  );

  const addChatMessage = useCallback(
    (role: "user" | "assistant", content: string) => {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          role,
          content,
          timestamp: new Date().toISOString(),
        },
      ]);
    },
    []
  );

  const addEvent = useCallback((event: Omit<CalendarEvent, "id">) => {
    setEvents((prev) => [
      ...prev,
      { ...event, id: `c-${Date.now()}` },
    ]);
  }, []);

  const value = useMemo(
    () => ({
      emails,
      tasks,
      events,
      chatMessages,
      insights,
      stats,
      categorizeEmails,
      toggleTaskComplete,
      markEmailRead,
      moveEmailCategory,
      addChatMessage,
      addEvent,
    }),
    [
      emails,
      tasks,
      events,
      chatMessages,
      insights,
      stats,
      categorizeEmails,
      toggleTaskComplete,
      markEmailRead,
      moveEmailCategory,
      addChatMessage,
      addEvent,
    ]
  );

  return <CRMContext.Provider value={value}>{children}</CRMContext.Provider>;
}

export function useCRM() {
  const ctx = useContext(CRMContext);
  if (!ctx) throw new Error("useCRM must be used within CRMProvider");
  return ctx;
}

export function useDashboardStats() {
  const { emails, tasks, events, stats } = useCRM();
  return {
    ...stats,
    emailCount: emails.length,
    unreadEmails: emails.filter((e) => !e.read).length,
    pendingTasks: tasks.filter((t) => !t.completed).length,
    upcomingEvents: events.filter(
      (e) => new Date(e.start) >= new Date()
    ).length,
  };
}
