import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { mapTask } from "@/lib/mappers";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await requireUserId();
    const { id } = await params;
    const body = await request.json();

    const task = await prisma.task.findFirst({ where: { id, userId } });
    if (!task) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = await prisma.task.update({
      where: { id },
      data: {
        ...(body.completed !== undefined && { completed: body.completed }),
      },
    });

    return NextResponse.json(mapTask(updated));
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
