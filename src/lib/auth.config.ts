import type { NextAuthConfig } from "next-auth";

// Kept deliberately minimal and free of Node.js-only imports (Prisma, bcrypt,
// nodemailer, googleapis, etc.) so it can be safely imported from
// src/middleware.ts, which runs in the Edge runtime. The full config with
// providers/adapter lives in src/lib/auth.ts and extends this file.
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [],
};
