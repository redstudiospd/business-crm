# OperaOPS — Quick README (new features)

This repository now includes the OperaOPS homepage, authentication, manual file uploads, manual mail compose, and manual calendar scheduling features.

Key pages
- `/` — OperaOPS homepage
- `/login` — Sign in (Google, Microsoft, Apple, Email link, demo)
- `/dashboard` — CRM dashboard (moved under CRM layout)
- `/uploads` — Manual file upload UI
- `/emails/compose` — Compose and save drafts
- `/calendar/create` — Manual event scheduling

API endpoints
- `POST /api/uploads` — save uploaded file to `FileUpload` (Prisma)
- `POST /api/compose` — save composed mail as an `Email` record
- `POST /api/events` — create a `CalendarEvent` record
- `GET|POST /api/auth/[...nextauth]` — NextAuth handlers

Important environment variables
- `DATABASE_URL` — SQLite (or libSQL/Turso) connection string
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- `AZURE_AD_CLIENT_ID`, `AZURE_AD_CLIENT_SECRET`, `AZURE_AD_TENANT_ID` (optional)
- `APPLE_CLIENT_ID`, `APPLE_CLIENT_SECRET` (optional)
- `EMAIL_SERVER_HOST`, `EMAIL_SERVER_PORT`, `EMAIL_SERVER_USER`, `EMAIL_SERVER_PASSWORD`, `EMAIL_FROM` — for Email sign-in
- `DEMO_LOGIN=true` — enable seeded demo user

Notes & dependencies
- Prisma: `prisma/schema.prisma` includes `FileUpload`, `CalendarEvent`, etc. Run `npx prisma generate` after changing schema.
- Prisma adapter: `@prisma/adapter-libsql` was installed and wired in `src/lib/prisma.ts`.
- Email provider uses `nodemailer` (already installed).

Quick start
```bash
npm install
npx prisma generate --schema=prisma/schema.prisma
npm run dev
```

Quick test checklist
- Visit `/` and `/login` to confirm homepage and auth UI render.
- Turn on `DEMO_LOGIN=true` and sign in via demo credentials to test protected routes.
- Upload a file at `/uploads` and confirm a record appears in the database.
- Compose a mail at `/emails/compose` and create an event at `/calendar/create` to verify API endpoints.

If you want, I can add a short `README.md` merge into the main README or create a dedicated `docs/` folder next.
