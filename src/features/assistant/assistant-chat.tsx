"use client";

import { Send, Sparkles } from "lucide-react";
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

  async function send() {
    if (!prompt.trim()) return;
    const current = prompt;
    setMessages((items) => [...items, { role: "user", content: current }]);
    setPrompt("");
    setIsSending(true);
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: current })
    });
    const body = await response.json();
    setIsSending(false);
    if (!response.ok) {
      toast.error(body.error ?? "Assistant failed");
      return;
    }
    setMessages((items) => [
      ...items,
      {
        role: "assistant",
        content: `Executed ${body.command.actions.length} action${body.command.actions.length === 1 ? "" : "s"}.`
      }
    ]);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent text-accent-foreground">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">AI Assistant</h1>
          <p className="text-sm text-muted-foreground">Send follow-ups, schedule meetings, and adjust events through Corsair.</p>
        </div>
      </div>
      <Card className="min-h-[440px] p-4">
        <div className="space-y-3">
          {messages.map((message, index) => (
            <div key={index} className={message.role === "user" ? "ml-auto max-w-[80%] rounded-lg bg-primary p-3 text-primary-foreground" : "max-w-[80%] rounded-lg bg-muted p-3"}>
              {message.content}
            </div>
          ))}
          {!messages.length ? (
            <div className="grid gap-2 text-sm text-muted-foreground">
              <button onClick={() => setPrompt("Send a follow-up email to Rahul.")} className="rounded-md border p-3 text-left hover:bg-muted">Send a follow-up email to Rahul.</button>
              <button onClick={() => setPrompt("Schedule a client meeting next Friday.")} className="rounded-md border p-3 text-left hover:bg-muted">Schedule a client meeting next Friday.</button>
              <button onClick={() => setPrompt("Move tomorrow's meeting to 4 PM.")} className="rounded-md border p-3 text-left hover:bg-muted">Move tomorrow's meeting to 4 PM.</button>
            </div>
          ) : null}
        </div>
      </Card>
      <div className="flex gap-3">
        <Textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Ask Corsair Agent to act..." className="min-h-20" />
        <Button onClick={send} disabled={isSending} className="h-20 w-20" size="icon">
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
