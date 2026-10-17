# Aeson.ai — AI-Powered Business CRM

A full-featured CRM with six AI-powered modules for small business owners.

## Features

1. **Dashboard** — P&L charts, revenue/expense analytics, loss reason analysis, and improvement tips
2. **Email Assistant** — AI categorizes emails into Important, Follow-up, Spam, Newsletter folders
3. **Calendar & Scheduling** — Auto-scheduled meetings and deadlines from email analysis
4. **Task Manager** — Priority-sorted tasks from Critical ("do right now") to Least Priority
5. **Business Insights** — AI-generated actionable advice from profit/loss data
6. **AI Chat Assistant** — Ask questions about finances, tasks, emails, and calendar

## Getting Started

```bash
npm install
npm run dev
```

For local development, open http://localhost:3000.

For production deployments, set `NEXTAUTH_URL` (and `AUTH_URL` if used) to your public app URL, e.g. https://aesonai.vercel.app

## Optional: Anthropic API Integration

Set `ANTHROPIC_API_KEY` in `.env.local` to enable Sonnet5-powered chat responses. Without it, the built-in rule-based AI handles all features.

```env
ANTHROPIC_API_KEY=sk-...
```

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- Recharts
- neondb
- prisma
- vercel
- Lucide Icons

## Project Structure

```
src/
├── app/(crm)/          # CRM pages (dashboard, emails, calendar, tasks, insights, chat)
├── app/api/chat/       # AI chat API route
├── components/         # Feature UI components
└── lib/                # Types, mock data, AI logic, state store
```

Built to help businesses.
