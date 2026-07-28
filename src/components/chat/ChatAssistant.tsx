"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { useCRM } from "@/lib/store";
import { cn, formatDateTime } from "@/lib/utils";

const suggestions = [
  "Why are we losing money?",
  "What are my critical tasks?",
  "How can I improve the business?",
  "What's on my calendar?",
];

export function ChatAssistant() {
  const { chatMessages, addChatMessage, stats, tasks, emails, events } = useCRM();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const message = text.trim();
    setInput("");
    addChatMessage("user", message);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          context: {
            pendingTasks: tasks.filter((t) => !t.completed).length,
            unreadEmails: emails.filter((e) => !e.read).length,
            upcomingEvents: events.filter((e) => new Date(e.start) >= new Date()).length,
          },
        }),
      });
      const data = await res.json();
      addChatMessage("assistant", data.reply);
    } catch {
      addChatMessage(
        "assistant",
        "Sorry, I encountered an error. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">AI Chat Assistant</h1>
        <p className="mt-1 text-slate-400">
          Ask questions about your business data, tasks, emails, and insights
        </p>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50">
        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex gap-3",
                msg.role === "user" ? "flex-row-reverse" : ""
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                  msg.role === "user" ? "bg-indigo-600" : "bg-slate-800"
                )}
              >
                {msg.role === "user" ? (
                  <User className="h-4 w-4 text-white" />
                ) : (
                  <Bot className="h-4 w-4 text-indigo-400" />
                )}
              </div>
              <div
                className={cn(
                  "max-w-[75%] rounded-xl px-4 py-3 text-sm leading-relaxed",
                  msg.role === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-800 text-slate-200"
                )}
              >
                <p>{msg.content}</p>
                <p className="mt-1 text-[10px] opacity-50">
                  {formatDateTime(msg.timestamp)}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800">
                <Bot className="h-4 w-4 text-indigo-400" />
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-3 text-sm text-slate-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                Thinking...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-slate-800 p-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="rounded-full border border-slate-700 bg-slate-800/50 px-3 py-1 text-xs text-slate-400 transition hover:border-indigo-500/50 hover:text-indigo-300"
              >
                {s}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="flex gap-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about profits, tasks, emails, calendar..."
              className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
