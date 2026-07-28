import {
  generateChatResponse,
  generateChatResponseWithAI,
  getDashboardSummary,
} from "@/lib/ai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { message, context } = await request.json();

  const stats = getDashboardSummary();

  const aiReply = await generateChatResponseWithAI(message, stats);
  const reply =
    aiReply ??
    generateChatResponse(message, {
      stats,
      pendingTasks: context?.pendingTasks ?? 0,
      unreadEmails: context?.unreadEmails ?? 0,
      upcomingEvents: context?.upcomingEvents ?? 0,
    });

  return NextResponse.json({ reply });
}
