import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const userId = await requireUserId();
  const data = await request.json();
  const { to, subject, body } = data as {
    to: string;
    subject: string;
    body: string;
  };

  if (!to || !subject || !body) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  await prisma.email.create({
    data: {
      userId,
      from: "me@operaops.local",
      subject,
      preview: body.slice(0, 120),
      body,
      receivedAt: new Date().toISOString(),
      category: "uncategorized",
      read: false,
    },
  });

  return NextResponse.json({ success: true });
}
