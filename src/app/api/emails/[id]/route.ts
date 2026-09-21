import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { mapEmail } from "@/lib/mappers";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await requireUserId();
    const { id } = await params;
    const body = await request.json();

    const email = await prisma.email.findFirst({ where: { id, userId } });
    if (!email) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = await prisma.email.update({
      where: { id },
      data: {
        ...(body.read !== undefined && { read: body.read }),
        ...(body.category && { category: body.category }),
      },
    });

    return NextResponse.json(mapEmail(updated));
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST_categorize() {
  return null;
}
