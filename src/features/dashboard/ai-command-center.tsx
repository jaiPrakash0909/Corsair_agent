"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const examples = [
  "Send an email to john@example.com about project review.",
  "Schedule a meeting tomorrow at 3 PM.",
  "Schedule a meeting with Rahul tomorrow and send him an email."
];

export function AiCommandCenter() {
  const [prompt, setPrompt] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  async function run() {
    if (!prompt.trim()) return;
    setIsRunning(true);
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });
    const body = await response.json();
    setIsRunning(false);
    if (!response.ok) {
      toast.error(body.error ?? "Command failed");
      return;
    }
    toast.success("Actions completed");
    setPrompt("");
  }

  return (
    <motion.section className="rounded-lg border glass p-5 shadow-sm" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent text-accent-foreground">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">AI Command Center</h1>
          <p className="text-sm text-muted-foreground">Natural language to email and calendar actions.</p>
        </div>
      </div>
      <Textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="What would you like to do?" className="min-h-32 text-base" />
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button onClick={run} disabled={isRunning}>{isRunning ? "Working..." : "Execute"}</Button>
        {examples.map((example) => (
          <button key={example} onClick={() => setPrompt(example)} className="rounded-full border px-3 py-1 text-xs text-muted-foreground hover:bg-muted">
            {example}
          </button>
        ))}
      </div>
    </motion.section>
  );
}
