"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  categorizeAllEmails,
  generateInsights,
  getDashboardSummary,
} from "./ai";
import type {
  CalendarEvent,
  ChatMessage,
  Email,
  MonthlyFinance,
  Task,
} from "./types";

interface CRMContextValue {
  emails: Email[];
  tasks: Task[];
  events: CalendarEvent[];
  finances: MonthlyFinance[];
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
  const [emails, setEmails] = useState<Email[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [finances, setFinances] = useState<MonthlyFinance[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [insights, setInsights] = useState<ReturnType<typeof generateInsights>>([]);
  const [stats, setStats] = useState<ReturnType<typeof getDashboardSummary>>(getDashboardSummary([]));

  useEffect(() => {
    let isActive = true;

    async function loadData() {
      try {
        const res = await fetch("/api/data", { cache: "no-store" });
        if (!res.ok) {
          if (!isActive) return;
          setEmails([]);
          setTasks([]);
          setEvents([]);
          setFinances([]);
          setChatMessages([]);
          setInsights([]);
          setStats(getDashboardSummary([]));
          return;
        }

        const data = await res.json();
        if (!isActive) return;

        const nextFinances = Array.isArray(data.finances) ? data.finances : [];
        const nextEmails = Array.isArray(data.emails) ? data.emails : [];
        const nextTasks = Array.isArray(data.tasks) ? data.tasks : [];
        const nextEvents = Array.isArray(data.events) ? data.events : [];
        const nextChatMessages = Array.isArray(data.chatMessages) ? data.chatMessages : [];

        setEmails(nextEmails);
        setTasks(nextTasks);
        setEvents(nextEvents);
        setFinances(nextFinances);
        setChatMessages(nextChatMessages.length > 0 ? nextChatMessages : [
          {
            id: "welcome",
            role: "assistant",
            content:
              "Welcome to your Business CRM! I can answer questions about your finances, tasks, emails, and calendar. What would you like to know?",
            timestamp: new Date().toISOString(),
          },
        ]);
        setInsights(Array.isArray(data.insights) ? data.insights : generateInsights(nextFinances));
        setStats(data.stats ?? getDashboardSummary(nextFinances));
      } catch {
        if (!isActive) return;
        setEmails([]);
        setTasks([]);
        setEvents([]);
        setFinances([]);
        setChatMessages([]);
        setInsights([]);
        setStats(getDashboardSummary([]));
      }
    }

    loadData();
    return () => {
      isActive = false;
    };
  }, []);

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
      finances,
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
      finances,
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
