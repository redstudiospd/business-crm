import bcrypt from "bcryptjs";
import prisma from "./prisma";
import {
  initialEmails,
  initialEvents,
  initialTasks,
  monthlyFinances,
} from "./data";

export async function seedUserData(userId: string) {
  const existing = await prisma.email.count({ where: { userId } });
  if (existing > 0) return;

  await prisma.$transaction([
    ...monthlyFinances.map((f) =>
      prisma.monthlyFinance.create({
        data: { userId, month: f.month, revenue: f.revenue, expenses: f.expenses },
      })
    ),
    ...initialEmails.map((e) =>
      prisma.email.create({
        data: {
          userId,
          from: e.from,
          subject: e.subject,
          preview: e.preview,
          body: e.body,
          receivedAt: new Date(e.receivedAt),
          category: e.category,
          read: e.read,
        },
      })
    ),
    ...initialTasks.map((t) =>
      prisma.task.create({
        data: {
          userId,
          title: t.title,
          description: t.description,
          priority: t.priority,
          dueDate: t.dueDate ? new Date(t.dueDate) : null,
          completed: t.completed,
          sourceEmailId: t.sourceEmailId,
        },
      })
    ),
    ...initialEvents.map((e) =>
      prisma.calendarEvent.create({
        data: {
          userId,
          title: e.title,
          description: e.description,
          start: new Date(e.start),
          end: new Date(e.end),
          type: e.type,
          sourceEmailId: e.sourceEmailId,
        },
      })
    ),
    prisma.chatMessage.create({
      data: {
        userId,
        role: "assistant",
        content:
          "Welcome to your Business CRM! I can answer questions about your finances, tasks, emails, and calendar. What would you like to know?",
      },
    }),
  ]);
}

export async function ensureDemoUser() {
  if (process.env.DEMO_LOGIN !== "true") return;

  const email = "demo@operaops.local";
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return;

  const passwordHash = await bcrypt.hash("demo1234", 10);
  const user = await prisma.user.create({
    data: {
      email,
      name: "Demo User",
      passwordHash,
    },
  });
  await seedUserData(user.id);
}
