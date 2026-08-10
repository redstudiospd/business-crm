import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const userId = await requireUserId();
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    await prisma.fileUpload.create({
      data: {
        userId,
        filename: file.name,
        mimeType: file.type || "application/octet-stream",
        size: file.size,
        content: Buffer.from(buffer),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
