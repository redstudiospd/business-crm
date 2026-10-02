import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import Email from "next-auth/providers/email";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import { prisma } from "./prisma";
import { DEMO_USER_EMAIL, ensureDemoUser, isDemoUserEmail, seedUserData } from "./seed";
import { authConfig } from "./auth.config";

const providers: NextAuthConfig["providers"] = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/calendar.readonly",
          access_type: "offline",
          prompt: "consent",
        },
      },
      allowDangerousEmailAccountLinking: true,
    })
  );
}

if (process.env.AZURE_AD_CLIENT_ID && process.env.AZURE_AD_CLIENT_SECRET) {
  providers.push(
    MicrosoftEntraID({
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      issuer: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID ?? "common"}/v2.0`,
      authorization: {
        params: {
          scope:
            "openid email profile offline_access Mail.Read Mail.ReadWrite Calendars.Read",
        },
      },
      allowDangerousEmailAccountLinking: true,
    })
  );
}


if (
  process.env.EMAIL_SERVER_HOST &&
  process.env.EMAIL_SERVER_PORT &&
  process.env.EMAIL_FROM
) {
  providers.push(
    Email({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    })
  );
}

if (process.env.DEMO_LOGIN === "true") {
  providers.push(
    Credentials({
      name: "Demo Account",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        await ensureDemoUser();
        const email = credentials?.email as string;
        const password = credentials?.password as string;
        if (!email || !password) return null;
        if (!isDemoUserEmail(email)) return null;

        const user = await prisma.user.findUnique({ where: { email: DEMO_USER_EMAIL } });
        if (!user?.passwordHash) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return { id: user.id, email: user.email, name: user.name };
      },
    })
  );
}

async function seedUserIfNeeded(user: { id?: string | null; email?: string | null }) {
  if (user.id && isDemoUserEmail(user.email)) await seedUserData(user.id);
}

export const fullAuthConfig: NextAuthConfig = {
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers,
  session: { strategy: "jwt" },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user?.id) token.sub = user.id;
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    signIn: async ({ user, account }) => {
      if (!user?.email) return false;

      // Block linking/sign-in as a different account while a session is active
      const current = await auth();
      const currentEmail = current?.user?.email?.toLowerCase();
      if (currentEmail && currentEmail !== user.email.toLowerCase()) {
        return "/dashboard"; // abort, link nothing
      }

      if (isDemoUserEmail(user.email)) {
        return account?.provider === "credentials";
      }
      return true;
    },
  },
  events: {
    createUser: async ({ user }) => {
      await seedUserIfNeeded(user);
    },
  },
  trustHost: true,
};

export const { handlers, auth, signIn, signOut } = NextAuth(fullAuthConfig);

export async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user.id;
}
