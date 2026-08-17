Summary of production-related changes and checklist

What I changed

- prisma/schema.prisma: datasource provider changed from `sqlite` to `postgresql` and now uses `url = env("DATABASE_URL")`.
- src/lib/prisma.ts: removed the `@prisma/adapter-libsql` usage and switched to the standard `PrismaClient` initialization appropriate for Postgres/MySQL.
- .env.example: replaced dev/local values with production-shaped placeholders and added `NEXTAUTH_SECRET` alias.

Flagged hardcoded "localhost:3000" occurrences (outside .env files)

- README.md: previously contained a link to http://localhost:3000 — updated to reference local dev and remind to set `NEXTAUTH_URL` for production.
- Other matches for "localhost:3000" were found under the `.next/` build artifacts and node_modules (library defaults) and are NOT source files; no other source files in `src/` contained `localhost:3000`.

Serverless / production checks

- `src/lib/auth.ts` uses `session: { strategy: "jwt" }` which is serverless-friendly.
- No in-memory session store or local filesystem writes were found in `src/` that would break serverless on Vercel.
- `src/lib/prisma.ts` originally used `PrismaLibSql` which is for libsql; I replaced it with the standard `PrismaClient` for hosted Postgres/MySQL.

Security note

- `.env` currently contains an exposed `ANTHROPIC_API_KEY`. Treat this key as compromised and rotate it immediately at Anthropic. Do not commit new secrets to the repo; use Vercel environment variables.

Required environment variables (set these in Vercel)

- DATABASE_URL: Connection string for your hosted DB (postgresql://user:pass@host:5432/dbname or mysql://...).
- NEXTAUTH_URL / AUTH_URL: Public app URL (e.g. https://app.example.com) used by NextAuth callbacks/redirects. Set `NEXTAUTH_URL`; `AUTH_URL` can be an alias.
- NEXTAUTH_SECRET / AUTH_SECRET: Long random secret for NextAuth/session signing.
- GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET: Google OAuth credentials (Gmail/calendar integrations).
- AZURE_AD_CLIENT_ID / AZURE_AD_CLIENT_SECRET / AZURE_AD_TENANT_ID: Microsoft OAuth credentials (Outlook/calendar).
- EMAIL_SERVER_HOST / EMAIL_SERVER_PORT / EMAIL_SERVER_USER / EMAIL_SERVER_PASSWORD / EMAIL_FROM: SMTP settings for Email provider.
- ANTHROPIC_API_KEY: (Optional) Anthropic key — rotate if exposed.
- OPENAI_API_KEY: (Optional) OpenAI key.
- DEMO_LOGIN: `true` or `false` (avoid `true` in production unless intended).

Migration and deployment steps (manual)

1. Provision a hosted Postgres (or MySQL) database and set `DATABASE_URL` in Vercel.
2. Set all required environment variables in Vercel (listed above).
3. Locally or in a CI environment, generate Prisma client and create/apply migrations:

```bash
npx prisma generate
npx prisma migrate dev --name init
# OR if you prefer to push schema without migrations:
# npx prisma db push
```

4. Build and deploy to Vercel.

Notes & rollback

- I did NOT run migrations or push schema to any database.
- If you prefer MySQL instead of Postgres, edit `prisma/schema.prisma` to set `provider = "mysql"` and then run `npx prisma generate`.

If you want, I can:
- switch `prisma/schema.prisma` to MySQL instead of Postgres,
- add a short `SECURITY.md` with immediate steps for key rotation,
- open a PR with these changes and add CI steps for migrations.

Contact me with which next step you'd like me to take.
