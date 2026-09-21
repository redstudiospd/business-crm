import bcrypt from "bcryptjs";
import prisma from "./prisma";
import {
  initialEmails,
  initialEvents,
  initialTasks,
  monthlyFinances,
} from "./data";

export const DEMO_USER_EMAIL = process.env.DEMO_USER_EMAIL ?? "demo@aesonops.local";

export function isDemoUserEmail(email?: string | null): boolean {
  return !!email && email.toLowerCase() === DEMO_USER_EMAIL.toLowerCase();
}

export async function seedUserData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });

  if (!user || !isDemoUserEmail(user.email)) return;

  const existing = await prisma.email.count({ where: { userId } });
  if (existing > 0) return;

  await prisma.$transaction([
    prisma.monthlyFinance.createMany({
      data: monthlyFinances.map((f) => ({
        userId, month: f.month, revenue: f.revenue, expenses: f.expenses,
      })),
    }),
    prisma.email.createMany({
      data: initialEmails.map((e) => ({
        userId, from: e.from, subject: e.subject, preview: e.preview,
        body: e.body, receivedAt: new Date(e.receivedAt),
        category: e.category, read: e.read,
      })),
    }),
    prisma.task.createMany({
      data: initialTasks.map((t) => ({
        userId, title: t.title, description: t.description,
        priority: t.priority, dueDate: t.dueDate ? new Date(t.dueDate) : null,
        completed: t.completed, sourceEmailId: t.sourceEmailId,
      })),
    }),
    prisma.calendarEvent.createMany({
      data: initialEvents.map((e) => ({
        userId, title: e.title, description: e.description,
        start: new Date(e.start), end: new Date(e.end),
        type: e.type, sourceEmailId: e.sourceEmailId,
      })),
    }),
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
  

  const existing = await prisma.user.findUnique({ where: { email: DEMO_USER_EMAIL } });
  if (existing) {
    await seedUserData(existing.id);
    return;
  };

  const passwordHash = await bcrypt.hash("demo1234", 10);
  const user = await prisma.user.create({
    data: {
      email: DEMO_USER_EMAIL,
      name: "Demo User",
      passwordHash,
    },
  });
  await seedUserData(user.id);
}
