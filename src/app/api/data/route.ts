import { NextResponse } from "next/server";
import { auth, requireUserId } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateInsights, getDashboardSummary } from "@/lib/ai";
import { mapChatMessage, mapEmail, mapEvent, mapTask } from "@/lib/mappers";
import { ensureDemoUser, isDemoUserEmail } from "@/lib/seed";

export async function GET() {
  try {
    const userId = await requireUserId();
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (currentUser && isDemoUserEmail(currentUser.email)) {
      await ensureDemoUser();
    }

    const [emails, tasks, events, chatMessages, finances, accounts] =
      await Promise.all([
        prisma.email.findMany({
          where: { userId },
          orderBy: { receivedAt: "desc" },
        }),
        prisma.task.findMany({ where: { userId } }),
        prisma.calendarEvent.findMany({
          where: { userId },
          orderBy: { start: "asc" },
        }),
        prisma.chatMessage.findMany({
          where: { userId },
          orderBy: { timestamp: "asc" },
        }),
        prisma.monthlyFinance.findMany({
          where: { userId },
          orderBy: { month: "asc" },
        }),
        prisma.account.findMany({
          where: { userId },
          select: { provider: true, providerAccountId: true },
        }),
      ]);

    const financeData = finances.map(
      (f: { month: string; revenue: number; expenses: number }) => ({
        month: f.month,
        revenue: f.revenue,
        expenses: f.expenses,
      })
    );

    const stats = getDashboardSummary(financeData);
    const insights = generateInsights(financeData);

    return NextResponse.json({
      emails: emails.map(mapEmail),
      tasks: tasks.map(mapTask),
      events: events.map(mapEvent),
      chatMessages: chatMessages.map(mapChatMessage),
      finances: financeData,
      insights,
      stats,
      connectedProviders: accounts.map(
        (a: { provider: string }) => a.provider
      ),
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function GET_session() {
  return auth();
}
