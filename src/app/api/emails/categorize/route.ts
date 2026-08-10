import { NextResponse } from "next/server";
import type { Email as DBEmail } from "@prisma/client";
import { requireUserId } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { categorizeEmail } from "@/lib/ai";
import { mapEmail } from "@/lib/mappers";

export async function POST() {
  try {
    const userId = await requireUserId();
    const emails: DBEmail[] = await prisma.email.findMany({ where: { userId } });

    const updated = await Promise.all(
      emails.map(async (email) => {
        const category = categorizeEmail({
          id: email.id,
          from: email.from,
          subject: email.subject,
          preview: email.preview,
          body: email.body,
          receivedAt: email.receivedAt.toISOString(),
          category: email.category as "uncategorized",
          read: email.read,
        });
        if (category === email.category) return email;
        return prisma.email.update({
          where: { id: email.id },
          data: { category },
        });
      })
    );

    return NextResponse.json({
      emails: updated.map((email) => mapEmail(email)),
      count: updated.filter((e: { category: string }) => e.category !== "uncategorized").length,
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
