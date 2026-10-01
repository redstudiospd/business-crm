import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isDemoUserEmail } from "@/lib/seed";

// User ID function

export async function POST(request: Request) {
  try {
    const userId = await requireUserId();
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (currentUser && isDemoUserEmail(currentUser.email)) {
      return NextResponse.json(
        { error: "The demo account is shared and read-only, so files can't be uploaded here. Sign in with Google or Microsoft to upload your own files." },
        { status: 403 }
      );
    }

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
    console.error(error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

} 