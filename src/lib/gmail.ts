import { google } from "googleapis";
import type { Account } from "@prisma/client";
import { prisma } from "./prisma";
import { categorizeEmail } from "./ai";
import type { EmailCategory } from "./types";

function decodeBase64Url(data: string): string {
  const normalized = data.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(normalized, "base64").toString("utf-8");
}

function extractBody(
  payload: { mimeType?: string | null; body?: { data?: string | null }; parts?: unknown[] }
): string {
  if (payload.mimeType === "text/plain" && payload.body?.data) {
    return decodeBase64Url(payload.body.data);
  }
  if (payload.parts) {
    for (const part of payload.parts as {
      mimeType?: string | null;
      body?: { data?: string | null };
      parts?: unknown[];
    }[]) {
      const text = extractBody(part);
      if (text) return text;
    }
  }
  if (payload.body?.data) return decodeBase64Url(payload.body.data);
  return "";
}

function getHeader(
  headers:
    | { name?: string | null; value?: string | null }[]
    | undefined,
  name: string
): string {
  return headers?.find((h) => h.name?.toLowerCase() === name.toLowerCase())?.value ?? "";
}

export async function syncGmailEmails(userId: string, account: Account, accessToken: string) {
  const oauth2 = new google.auth.OAuth2();
  oauth2.setCredentials({ access_token: accessToken });
  const gmail = google.gmail({ version: "v1", auth: oauth2 });

  const list = await gmail.users.messages.list({
    userId: "me",
    maxResults: 30,
    q: "in:inbox",
  });

  const messages = list.data.messages ?? [];
  let synced = 0;

  for (const msg of messages) {
    if (!msg.id) continue;
    const full = await gmail.users.messages.get({
      userId: "me",
      id: msg.id,
      format: "full",
    });

    const headers = full.data.payload?.headers;
    const from = getHeader(headers, "From");
    const subject = getHeader(headers, "Subject") || "(No subject)";
    const dateStr = getHeader(headers, "Date");
    const body = extractBody(full.data.payload ?? {}) || full.data.snippet || "";
    const preview = full.data.snippet ?? body.slice(0, 120);

    const receivedAt = dateStr ? new Date(dateStr) : new Date();
    const emailData = {
      from,
      subject,
      preview,
      body,
      receivedAt,
    };

    const category = categorizeEmail({
      id: msg.id,
      ...emailData,
      receivedAt: receivedAt.toISOString(),
      category: "uncategorized" as EmailCategory,
      read: !full.data.labelIds?.includes("UNREAD"),
    });

    await prisma.email.upsert({
      where: {
        userId_externalId_provider: {
          userId,
          externalId: msg.id,
          provider: "google",
        },
      },
      create: {
        userId,
        externalId: msg.id,
        provider: "google",
        ...emailData,
        category,
        read: !full.data.labelIds?.includes("UNREAD"),
      },
      update: {
        ...emailData,
        read: !full.data.labelIds?.includes("UNREAD"),
      },
    });
    synced++;
  }

  return synced;
}

export async function syncGmailCalendar(userId: string, accessToken: string) {
  const oauth2 = new google.auth.OAuth2();
  oauth2.setCredentials({ access_token: accessToken });
  const calendar = google.calendar({ version: "v3", auth: oauth2 });

  const now = new Date();
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const res = await calendar.events.list({
    calendarId: "primary",
    timeMin: now.toISOString(),
    timeMax: in30Days.toISOString(),
    maxResults: 20,
    singleEvents: true,
    orderBy: "startTime",
  });

  let synced = 0;
  for (const event of res.data.items ?? []) {
    if (!event.id || !event.summary) continue;
    const start = event.start?.dateTime ?? event.start?.date;
    const end = event.end?.dateTime ?? event.end?.date;
    if (!start || !end) continue;

    const existing = await prisma.calendarEvent.findFirst({
      where: { userId, externalId: event.id, provider: "google" },
    });

    if (existing) {
      await prisma.calendarEvent.update({
        where: { id: existing.id },
        data: {
          title: event.summary,
          description: event.description ?? "",
          start: new Date(start),
          end: new Date(end),
        },
      });
    } else {
      await prisma.calendarEvent.create({
        data: {
          userId,
          externalId: event.id,
          provider: "google",
          title: event.summary,
          description: event.description ?? "",
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

export async function sendGmailMessage(
  accessToken: string,
  to: string,
  subject: string,
  body: string
) {
  const oauth2 = new google.auth.OAuth2();
  oauth2.setCredentials({ access_token: accessToken });
  const gmail = google.gmail({ version: "v1", auth: oauth2 });

  const messageParts = [
    `To: ${to}`,
    `Subject: ${subject}`,
    "Content-Type: text/plain; charset=utf-8",
    "",
    body,
  ];
  const message = messageParts.join("\n");

  const encodedMessage = Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const res = await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: encodedMessage,
    },
  });

  return res.data;
}

export async function createGmailDraft(
  accessToken: string,
  to: string,
  subject: string,
  body: string
) {
  const oauth2 = new google.auth.OAuth2();
  oauth2.setCredentials({ access_token: accessToken });
  const gmail = google.gmail({ version: "v1", auth: oauth2 });

  const messageParts = [
    `To: ${to}`,
    `Subject: ${subject}`,
    "Content-Type: text/plain; charset=utf-8",
    "",
    body,
  ];
  const message = messageParts.join("\n");

  const encodedMessage = Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const res = await gmail.users.drafts.create({
    userId: "me",
    requestBody: {
      message: {
        raw: encodedMessage,
      },
    },
  });

  return res.data;
}