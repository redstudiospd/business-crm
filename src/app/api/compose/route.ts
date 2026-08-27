import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getValidAccessToken } from "@/lib/tokens";
import { sendGmailMessage, createGmailDraft } from "@/lib/gmail";
import { isDemoUserEmail } from "@/lib/seed";

export async function POST(request: Request) {
  const userId = await requireUserId();
  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });

  if (currentUser && isDemoUserEmail(currentUser.email)) {
    return NextResponse.json(
      { error: "Demo accounts cannot send live Gmail messages." },
      { status: 403 }
    );
  }

  const data = await request.json();
  const { to, subject, body, action } = data as {
    to: string;
    subject: string;
    body: string;
    action: "draft" | "send";
  };

  if (!to || !subject || !body) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const account = await prisma.account.findFirst({
    where: { userId, provider: "google" },
  });

  if (!account) {
    return NextResponse.json(
      { error: "No connected Google account found. Please sign in with Google." },
      { status: 400 }
    );
  }

  const accessToken = await getValidAccessToken(account);
  if (!accessToken) {
    return NextResponse.json(
      { error: "Could not get a valid Google access token. Try signing in again." },
      { status: 401 }
    );
  }

  try {
    if (action === "send") {
      const sent = await sendGmailMessage(accessToken, to, subject, body);

      await prisma.email.create({
        data: {
          userId,
          externalId: sent.id ?? undefined,
          provider: "google",
          from: "me",
          subject,
          preview: body.slice(0, 120),
          body,
          receivedAt: new Date(),
          category: "uncategorized",
          read: true,
        },
      });

      return NextResponse.json({ success: true, mode: "sent" });
    }

    const draft = await createGmailDraft(accessToken, to, subject, body);

    await prisma.email.create({
      data: {
        userId,
        externalId: draft.id ?? undefined,
        provider: "google",
        from: "me",
        subject,
        preview: body.slice(0, 120),
        body,
        receivedAt: new Date(),
        category: "draft",
        read: true,
      },
    });

    return NextResponse.json({ success: true, mode: "draft" });
  } catch (error) {
    console.error("Gmail compose error:", error);
    return NextResponse.json(
      { error: "Failed to reach Gmail. Try signing in again." },
      { status: 500 }
    );
  }
}