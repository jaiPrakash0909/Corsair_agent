"use client";

import { Send, Sparkles, Mail, Calendar, Inbox } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export function AssistantChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [summary, setSummary] = useState("");

  async function send() {
    if (!prompt.trim()) return;

    const current = prompt;

    setMessages((items) => [
      ...items,
      {
        role: "user",
        content: current,
      },
    ]);

    setPrompt("");
    setIsSending(true);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: current,
        }),
      });

      const body = await response.json();

      if (!response.ok) {
        toast.error(body.error ?? "Assistant failed");
        return;
      }

      let content =
  body.message ??
  `Executed ${body.command?.actions?.length ?? 0} action(s).`;

if (body.searchResults) {
  const emails = body.searchResults.emails ?? [];
  const events = body.searchResults.events ?? [];

  content =
    `Found ${emails.length} emails and ${events.length} events\n\n`;

  emails.slice(0, 5).forEach((email: any) => {
    content += `📧 ${email.subject}\n`;
  });

  events.slice(0, 5).forEach((event: any) => {
    content += `📅 ${event.title}\n`;
  });
}

setMessages((items) => [
  ...items,
  {
    role: "assistant",
    content,
  },
]);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-120px)] flex-col">
      {/* Header */}
      

      {/* Chat Area */}
      <Card className="flex-1 overflow-hidden rounded-3xl border">
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-y-auto p-6">
            {!messages.length ? (
              <div className="flex h-full flex-col items-center justify-center">
                <h2 className="mb-3 text-4xl font-bold">
                  Good Evening 👋
                </h2>

                <p className="mb-10 text-muted-foreground">
                  What would you like to do today?
                </p>

                <div className="grid w-full max-w-5xl gap-4 md:grid-cols-2">
                  <button
                    onClick={() =>
                      setPrompt("Draft a professional email")
                    }
                    className="rounded-2xl border p-5 text-left transition hover:bg-muted"
                  >
                    <Mail className="mb-3 h-5 w-5" />
                    <div className="font-medium">
                      Draft Email
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Create professional emails
                    </div>
                  </button>

                  <button
                    onClick={() =>
                      setPrompt(
                        "Schedule a meeting tomorrow"
                      )
                    }
                    className="rounded-2xl border p-5 text-left transition hover:bg-muted"
                  >
                    <Calendar className="mb-3 h-5 w-5" />
                    <div className="font-medium">
                      Schedule Meeting
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Create calendar events
                    </div>
                  </button>

                  <button
                    onClick={() =>
                      setPrompt(
                        "Show important emails"
                      )
                    }
                    className="rounded-2xl border p-5 text-left transition hover:bg-muted"
                  >
                    <Inbox className="mb-3 h-5 w-5" />
                    <div className="font-medium">
                      Important Emails
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Find priority emails
                    </div>
                  </button>

                  <button
                    onClick={async () => {
  const res = await fetch(
    "/api/inbox-summary"
  );

  const data = await res.json();

  setMessages((prev) => [
    ...prev,
    {
      role: "assistant",
      content: data.summary,
    },
  ]);
}}
                    className="rounded-2xl border p-5 text-left transition hover:bg-muted"
                  >
                    <Sparkles className="mb-3 h-5 w-5" />
                    <div className="font-medium">
                      Summarize Inbox
                    </div>
                    <div className="text-sm text-muted-foreground">
                      AI inbox summary
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-3xl px-5 py-4 ${
                        message.role === "user"
                          ? "bg-[#127173] text-white"
                          : "bg-zinc-800 text-white"
                      }`}
                    >
                      <div className="whitespace-pre-wrap">
  {message.content}
</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4">



        <div className="relative">
  <Textarea
    value={prompt}
    onChange={(e) => setPrompt(e.target.value)}
    placeholder="Ask anything..."
    className="
      rounded-2xl
      min-h-[80px]
      resize-none
      pr-14
      border-zinc-800
      bg-black
      focus-visible:ring-0
    "
  />

  <button
    onClick={send}
    disabled={isSending}
    className="
      absolute
      bottom-4
      right-4
      flex
      h-9
      w-9
      items-center
      justify-center
      rounded-full
      bg-[#127173]
      text-white
      transition
      hover:bg-[#0f5c5d]
      disabled:opacity-50
    "
  >
    <Send className="h-4 w-4" />
  </button>
</div>


          </div>
        </div>
      </Card>
    </div>
  );
}















