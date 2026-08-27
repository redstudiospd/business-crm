#!/usr/bin/env node
// Safe demo-seed script for local use.
// Usage: DATABASE_URL="postgresql://..." node scripts/seed-demo.js

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const DEMO_USER_EMAIL = process.env.DEMO_USER_EMAIL || 'demo@operaops.local';

const monthlyFinances = [
  { month: 'Jan', revenue: 42000, expenses: 38000 },
  { month: 'Feb', revenue: 44500, expenses: 39500 },
  { month: 'Mar', revenue: 47000, expenses: 41000 },
  { month: 'Apr', revenue: 45200, expenses: 46800 },
  { month: 'May', revenue: 48900, expenses: 44200 },
  { month: 'Jun', revenue: 51200, expenses: 45100 },
  { month: 'Jul', revenue: 49800, expenses: 52400 },
];

const initialEmails = [
  {
    from: 'Sarah Chen <sarah@acmecorp.com>',
    subject: 'Q3 Contract Renewal — Action Required',
    preview: "Hi, we'd like to discuss renewing our enterprise agreement before August 15...",
    body: "Hi,\n\nWe'd like to discuss renewing our enterprise agreement before August 15. Can we schedule a call this week?\n\nBest,\nSarah Chen\nAcme Corp",
    receivedAt: new Date('2026-07-28T08:15:00'),
    category: 'uncategorized',
    read: false,
  },
  {
    from: 'noreply@dealsdaily.com',
    subject: '🔥 90% OFF — Limited Time Only!!!',
    preview: "Don't miss out on incredible savings on products you never asked for...",
    body: 'CLICK HERE NOW for amazing deals!!! Unsubscribe at bottom.',
    receivedAt: new Date('2026-07-28T07:42:00'),
    category: 'uncategorized',
    read: false,
  },
  {
    from: 'James Wilson <j.wilson@client.io>',
    subject: 'Project deadline moved to Friday',
    preview: 'Team, the deliverable deadline has been moved up to this Friday at 5 PM...',
    body: 'Team,\n\nThe deliverable deadline has been moved up to this Friday at 5 PM. Please confirm availability for a sync tomorrow at 2 PM.\n\nJames',
    receivedAt: new Date('2026-07-27T16:30:00'),
    category: 'uncategorized',
    read: false,
  },
];

const initialTasks = [
  {
    title: 'Respond to Acme Corp contract renewal',
    description: 'Schedule call before August 15 deadline',
    priority: 'critical',
    dueDate: new Date('2026-07-29'),
    completed: false,
  },
  {
    title: 'Pay overdue vendor invoice #8842',
    description: 'Invoice $3,240 — 14 days overdue',
    priority: 'critical',
    dueDate: new Date('2026-07-30'),
    completed: false,
  },
];

const initialEvents = [
  {
    title: 'Acme Corp renewal call',
    description: 'Call to discuss enterprise agreement renewal',
    start: new Date('2026-07-29T10:00:00'),
    end: new Date('2026-07-29T11:00:00'),
    type: 'meeting',
  },
];

async function main() {
  console.log('Demo seed starting.');

  // Create or find demo user
  let user = await prisma.user.findUnique({ where: { email: DEMO_USER_EMAIL } });
  if (!user) {
    const passwordHash = await bcrypt.hash('demo1234', 10);
    user = await prisma.user.create({ data: { email: DEMO_USER_EMAIL, name: 'Demo User', passwordHash } });
    console.log('Created demo user:', DEMO_USER_EMAIL);
  } else {
    console.log('Demo user already exists:', DEMO_USER_EMAIL);
  }

  const userId = user.id;

  // Check if user already has demo emails (avoid duplicating)
  const existingEmailCount = await prisma.email.count({ where: { userId } });
  if (existingEmailCount > 0) {
    console.log('Demo user already has data (email count:', existingEmailCount, '). Skipping seeding.');
    await prisma.$disconnect();
    return;
  }

  const tx = [];

  for (const m of monthlyFinances) {
    tx.push(prisma.monthlyFinance.create({ data: { userId, month: m.month, revenue: m.revenue, expenses: m.expenses } }));
  }

  for (const e of initialEmails) {
    tx.push(prisma.email.create({ data: { userId, from: e.from, subject: e.subject, preview: e.preview, body: e.body, receivedAt: e.receivedAt, category: e.category, read: e.read } }));
  }

  for (const t of initialTasks) {
    tx.push(prisma.task.create({ data: { userId, title: t.title, description: t.description, priority: t.priority, dueDate: t.dueDate, completed: t.completed } }));
  }

  for (const ev of initialEvents) {
    tx.push(prisma.calendarEvent.create({ data: { userId, title: ev.title, description: ev.description, start: ev.start, end: ev.end, type: ev.type } }));
  }

  tx.push(prisma.chatMessage.create({ data: { userId, role: 'assistant', content: "Welcome to your Business CRM! I can answer questions about your finances, tasks, emails, and calendar. What would you like to know?" } }));

  try {
    await prisma.$transaction(tx);
    console.log('Demo data seeded successfully for', DEMO_USER_EMAIL);
  } catch (err) {
    console.error('Failed to seed demo data:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
