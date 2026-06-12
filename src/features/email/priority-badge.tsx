import { Badge } from "@/components/ui/badge";

export function PriorityBadge({ priority }: { priority: "URGENT" | "IMPORTANT" | "NORMAL" }) {
  if (priority === "URGENT") return <Badge className="border-red-200 bg-red-50 text-red-700 dark:bg-red-950">Urgent</Badge>;
  if (priority === "IMPORTANT") return <Badge className="border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950">Important</Badge>;
  return <Badge className="border-slate-200 bg-slate-50 text-slate-700 dark:bg-slate-900">Normal</Badge>;
}
