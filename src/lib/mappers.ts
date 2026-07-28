import type {
  CalendarEvent as DBCalendarEvent,
  ChatMessage as DBChatMessage,
  Email as DBEmail,
  Task as DBTask,
} from "@prisma/client";
import type { CalendarEvent, ChatMessage, Email, Task } from "./types";

export function mapEmail(e: DBEmail): Email {
  return {
    id: e.id,
    from: e.from,
    subject: e.subject,
    preview: e.preview,
    body: e.body,
    receivedAt: e.receivedAt.toISOString(),
    category: e.category as Email["category"],
    read: e.read,
    provider: e.provider ?? undefined,
    externalId: e.externalId ?? undefined,
  };
}

export function mapTask(t: DBTask): Task {
  return {
    id: t.id,
    title: t.title,
    description: t.description,
    priority: t.priority as Task["priority"],
    dueDate: t.dueDate?.toISOString().slice(0, 10),
    completed: t.completed,
    sourceEmailId: t.sourceEmailId ?? undefined,
  };
}

export function mapEvent(e: DBCalendarEvent): CalendarEvent {
  return {
    id: e.id,
    title: e.title,
    description: e.description,
    start: e.start.toISOString(),
    end: e.end.toISOString(),
    type: e.type as CalendarEvent["type"],
    sourceEmailId: e.sourceEmailId ?? undefined,
    provider: e.provider ?? undefined,
  };
}

export function mapChatMessage(m: DBChatMessage): ChatMessage {
  return {
    id: m.id,
    role: m.role as ChatMessage["role"],
    content: m.content,
    timestamp: m.timestamp.toISOString(),
  };
}
