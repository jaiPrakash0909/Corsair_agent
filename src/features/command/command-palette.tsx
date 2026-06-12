"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CalendarPlus, Inbox, LayoutDashboard, MailPlus, Search, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUiStore } from "@/store/ui-store";

const actions = [
  { label: "Open Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Search Inbox", icon: Search, href: "/inbox" },
  { label: "Open Calendar", icon: CalendarPlus, href: "/calendar" },
  { label: "Send Email", icon: MailPlus, href: "/assistant?intent=email" },
  { label: "Create Event", icon: CalendarPlus, href: "/assistant?intent=event" }
];

export function CommandPalette() {
  const router = useRouter();
  const open = useUiStore((state) => state.commandOpen);
  const setOpen = useUiStore((state) => state.setCommandOpen);
  const [prompt, setPrompt] = useState("");

  async function runAiCommand() {
    if (!prompt.trim()) return;
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });
    const body = await response.json();
    if (!response.ok) {
      toast.error(body.error ?? "Command failed");
      return;
    }
    toast.success("Command executed");
    setPrompt("");
    setOpen(false);
    router.refresh();
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-50 bg-background/70 p-4 backdrop-blur" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={() => setOpen(false)}>
          <motion.div
            className="mx-auto mt-24 max-w-2xl rounded-lg border glass shadow-2xl"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b p-4">
              <Sparkles className="h-5 w-5 text-accent" />
              <Input autoFocus value={prompt} onChange={(event) => setPrompt(event.target.value)} onKeyDown={(event) => event.key === "Enter" && runAiCommand()} placeholder="What would you like to do?" className="border-0 bg-transparent text-base focus:ring-0" />
              <Button onClick={runAiCommand} size="sm">Run</Button>
            </div>
            <div className="grid gap-1 p-2">
              {actions.map((action) => (
                <button
                  key={action.label}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-muted"
                  onClick={() => {
                    router.push(action.href);
                    setOpen(false);
                  }}
                >
                  <action.icon className="h-4 w-4 text-muted-foreground" />
                  {action.label}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
