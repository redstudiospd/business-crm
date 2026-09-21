import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isDemoUserEmail } from "@/lib/seed";

export async function POST(request: Request) {
  const userId = await requireUserId();
  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });

  if (currentUser && isDemoUserEmail(currentUser.email)) {
    return NextResponse.json(
      { error: "The demo account is shared and read-only, so new events can't be saved. Sign in with Google, Microsoft, or Apple to create real events." },
      { status: 403 }
    );
  }

  const data = await request.json();
  const { title, description, start, end } = data as {
    title: string;
    description: string;
    start: string;
    end: string;
  };

  if (!title || !description || !start || !end) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  await prisma.calendarEvent.create({
    data: {
      userId,
      title,
      description,
      start: new Date(start),
      end: new Date(end),
      type: "meeting",
    },
  });

  return NextResponse.json({ success: true });
}
