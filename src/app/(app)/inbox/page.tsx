import Link from "next/link";
import { Archive, MailPlus, Star } from "lucide-react";
import { auth } from "@/lib/auth";
import { gmailService } from "@/services/gmail.service";
import { Card } from "@/components/ui/card";
import { PriorityBadge } from "@/features/email/priority-badge";

export default async function InboxPage({ searchParams }: { searchParams: Promise<{ q?: string; priority?: "URGENT" | "IMPORTANT" | "NORMAL" }> }) {
  const params = await searchParams;
  const session = await auth();
  const emails = await gmailService.listEmails(session!.user!.id, { query: params.q, priority: params.priority });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold">Smart Priority Inbox</h1>
        <Link href="/assistant?intent=email" className="ml-auto inline-flex h-8 items-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground">
          <MailPlus className="h-4 w-4" />Compose
        </Link>
      </div>
      <div className="flex gap-2">
        {["URGENT", "IMPORTANT", "NORMAL"].map((priority) => (
          <Link key={priority} href={`/inbox?priority=${priority}`} className="rounded-full border px-3 py-1 text-sm hover:bg-muted">{priority.toLowerCase()}</Link>
        ))}
        <Link href="/inbox" className="rounded-full border px-3 py-1 text-sm hover:bg-muted">all</Link>
      </div>
      <div className="grid gap-3">
        {emails.map((email) => (
          <Card key={email.id} className="p-4 transition hover:border-accent">
            <Link href={`/email/${email.id}`} className="grid gap-2 md:grid-cols-[1fr_auto]">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{email.subject}</span>
                  <PriorityBadge priority={email.priority} />
                  {email.starred ? <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> : null}
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{email.body}</p>
                <p className="mt-2 text-xs text-muted-foreground">{email.sender}</p>
              </div>
              <div className="flex items-start gap-2 text-muted-foreground">
                <Archive className="h-4 w-4" />
                <span className="text-xs">{email.createdAt.toLocaleDateString()}</span>
              </div>
            </Link>
          </Card>
        ))}
        {!emails.length ? <p className="rounded-lg border p-8 text-center text-sm text-muted-foreground">No emails found. Connect Gmail through Corsair and sync again.</p> : null}
      </div>
    </div>
  );
}
