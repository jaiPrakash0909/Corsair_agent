"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const examples = [
"Send an email to [john@example.com](mailto:john@example.com) about project review",
"Schedule a meeting tomorrow at 3 PM",
"Schedule a meeting with Rahul tomorrow and send him an email",
];

export function AiCommandCenter() {
const [prompt, setPrompt] = useState("");
const [isRunning, setIsRunning] = useState(false);

async function run() {
if (!prompt.trim()) return;


try {
  setIsRunning(true);

  const response = await fetch("/api/ai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
    }),
  });

  const body = await response.json();

  if (!response.ok) {
    toast.error(body.error ?? "Command failed");
    return;
  }

  toast.success("Actions completed");
  setPrompt("");
} catch {
  toast.error("Something went wrong");
} finally {
  setIsRunning(false);
}


}

return (
<motion.section
initial={{ opacity: 0, y: 15 }}
animate={{ opacity: 1, y: 0 }}
className="
rounded-3xl
border
border-zinc-800
bg-zinc-950/70
backdrop-blur-xl
overflow-hidden
"
> <div className="border-b border-zinc-800 p-6"> <div className="flex items-center gap-3"> <div
         className="
           flex h-11 w-11 items-center justify-center
           rounded-2xl
           bg-[#127173]
         "
       > <Sparkles className="h-5 w-5 text-white" /> </div>

```
      <div>
        <h2 className="text-xl font-semibold text-white">
          AI Workspace
        </h2>

        <p className="text-sm text-zinc-500">
          Ask Camail_ai to manage your emails and meetings.
        </p>
      </div>
    </div>
  </div>

  <div className="p-6">
    <textarea
      value={prompt}
      onChange={(e) => setPrompt(e.target.value)}
      placeholder="Schedule a meeting tomorrow at 3 PM and send an email to the team..."
      className="
        min-h-[160px]
        w-full
        resize-none
        rounded-2xl
        border
        border-zinc-800
        bg-black
        p-5
        text-base
        text-white
        outline-none
        placeholder:text-zinc-500
      "
    />

    <div className="mt-4 flex flex-wrap gap-2">
      {examples.map((example) => (
        <button
          key={example}
          onClick={() => setPrompt(example)}
          className="
            rounded-full
            border
            border-zinc-800
            bg-zinc-900
            px-4
            py-2
            text-xs
            text-zinc-400
            transition
            hover:bg-zinc-800
            hover:text-white
          "
        >
          {example}
        </button>
      ))}
    </div>

    <div className="mt-6 flex items-center justify-between">
      <p className="text-sm text-zinc-500">
        AI can create emails, events and workflows.
      </p>

      <button
        onClick={run}
        disabled={isRunning}
        className="
          flex items-center gap-2
          rounded-2xl
          bg-[#127173]
          px-5
          py-3
          font-medium
          text-white
          transition
          hover:opacity-90
          disabled:opacity-50
        "
      >
        {isRunning ? "Working..." : "Execute"}
        <ArrowUpRight className="h-4 w-4" />
      </button>
    </div>
  </div>
</motion.section>


);
}



