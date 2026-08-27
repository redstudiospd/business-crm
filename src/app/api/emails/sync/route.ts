import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { syncGmailEmails, syncGmailCalendar } from "@/lib/gmail";
import { syncOutlookForAccount } from "@/lib/outlook";
import { getValidAccessToken } from "@/lib/tokens";
import { mapEmail, mapEvent } from "@/lib/mappers";
import { isDemoUserEmail } from "@/lib/seed";

export async function POST() {
  try {
    const userId = await requireUserId();
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (currentUser && isDemoUserEmail(currentUser.email)) {
      return NextResponse.json(
        { error: "Demo accounts cannot sync live Gmail or Outlook accounts." },
        { status: 403 }
      );
    }

    const accounts = await prisma.account.findMany({
      where: {
        userId,
        provider: { in: ["google", "microsoft-entra-id"] },
      },
    });

    if (accounts.length === 0) {
      return NextResponse.json(
        {
          error: "No email account connected",
          hint: "Sign in with Google or Microsoft, or connect an account in Settings.",
        },
        { status: 400 }
      );
    }

    let emailsSynced = 0;
    let eventsSynced = 0;
    const providers: string[] = [];

    for (const account of accounts) {
      const accessToken = await getValidAccessToken(account);
      if (!accessToken) continue;

      if (account.provider === "google") {
        emailsSynced += await syncGmailEmails(userId, account, accessToken);
        eventsSynced += await syncGmailCalendar(userId, accessToken);
        providers.push("Gmail");
      }

      if (account.provider === "microsoft-entra-id") {
        const result = await syncOutlookForAccount(userId, account, accessToken);
        emailsSynced += result.emails;
        eventsSynced += result.events;
        providers.push("Outlook");
      }
    }

    const [emails, events] = await Promise.all([
      prisma.email.findMany({
        where: { userId },
        orderBy: { receivedAt: "desc" },
      }),
      prisma.calendarEvent.findMany({
        where: { userId },
        orderBy: { start: "asc" },
      }),
    ]);

    return NextResponse.json({
      emailsSynced,
      eventsSynced,
      providers,
      emails: emails.map(mapEmail),
      events: events.map(mapEvent),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Sync failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
