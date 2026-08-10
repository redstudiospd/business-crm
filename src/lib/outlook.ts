import type { Account } from "@prisma/client";
import prisma from "./prisma";
import { categorizeEmail } from "./ai";
import type { EmailCategory } from "./types";

interface GraphMessage {
  id: string;
  subject?: string;
  bodyPreview?: string;
  body?: { content?: string };
  from?: { emailAddress?: { name?: string; address?: string } };
  receivedDateTime?: string;
  isRead?: boolean;
}

interface GraphEvent {
  id: string;
  subject?: string;
  bodyPreview?: string;
  start?: { dateTime?: string };
  end?: { dateTime?: string };
}

export async function syncOutlookEmails(userId: string, accessToken: string) {
  const res = await fetch(
    "https://graph.microsoft.com/v1.0/me/messages?$top=30&$orderby=receivedDateTime desc&$select=id,subject,bodyPreview,body,from,receivedDateTime,isRead",
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!res.ok) throw new Error("Failed to fetch Outlook messages");
  const data = await res.json();
  const messages: GraphMessage[] = data.value ?? [];
  let synced = 0;

  for (const msg of messages) {
    const fromName = msg.from?.emailAddress?.name ?? "";
    const fromAddr = msg.from?.emailAddress?.address ?? "unknown";
    const from = fromName ? `${fromName} <${fromAddr}>` : fromAddr;
    const body = msg.body?.content?.replace(/<[^>]+>/g, " ").trim() ?? msg.bodyPreview ?? "";

    const receivedAt = msg.receivedDateTime ? new Date(msg.receivedDateTime) : new Date();
    const emailData = {
      from,
      subject: msg.subject ?? "(No subject)",
      preview: msg.bodyPreview ?? body.slice(0, 120),
      body,
      receivedAt,
    };

    const category = categorizeEmail({
      id: msg.id,
      ...emailData,
      receivedAt: receivedAt.toISOString(),
      category: "uncategorized" as EmailCategory,
      read: msg.isRead ?? false,
    });

    await prisma.email.upsert({
      where: {
        userId_externalId_provider: {
          userId,
          externalId: msg.id,
          provider: "microsoft",
        },
      },
      create: {
        userId,
        externalId: msg.id,
        provider: "microsoft",
        ...emailData,
        category,
        read: msg.isRead ?? false,
      },
      update: {
        ...emailData,
        read: msg.isRead ?? false,
      },
    });
    synced++;
  }

  return synced;
}

export async function syncOutlookCalendar(userId: string, accessToken: string) {
  const now = new Date().toISOString();
  const res = await fetch(
    `https://graph.microsoft.com/v1.0/me/calendarview?startDateTime=${now}&$top=20&$orderby=start/dateTime`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!res.ok) return 0;
  const data = await res.json();
  const events: GraphEvent[] = data.value ?? [];
  let synced = 0;

  for (const event of events) {
    if (!event.id || !event.subject) continue;
    const start = event.start?.dateTime;
    const end = event.end?.dateTime;
    if (!start || !end) continue;

    const existing = await prisma.calendarEvent.findFirst({
      where: { userId, externalId: event.id, provider: "microsoft" },
    });

    if (existing) {
      await prisma.calendarEvent.update({
        where: { id: existing.id },
        data: {
          title: event.subject,
          description: event.bodyPreview ?? "",
          start: new Date(start),
          end: new Date(end),
        },
      });
    } else {
      await prisma.calendarEvent.create({
        data: {
          userId,
          externalId: event.id,
          provider: "microsoft",
          title: event.subject,
          description: event.bodyPreview ?? "",
          start: new Date(start),
          end: new Date(end),
          type: "meeting",
        },
      });
    }
    synced++;
  }

  return synced;
}

export async function syncOutlookForAccount(userId: string, account: Account, accessToken: string) {
  const emails = await syncOutlookEmails(userId, accessToken);
  const events = await syncOutlookCalendar(userId, accessToken);
  return { emails, events };
}
