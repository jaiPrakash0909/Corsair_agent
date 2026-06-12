import { notFound } from "next/navigation";
import { Reply } from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { gmailService } from "@/services/gmail.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PriorityBadge } from "@/features/email/priority-badge";

export default async function EmailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const email = await gmailService.getEmail(session!.user!.id, id);
  if (!email) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold">{email.subject}</h1>
        <PriorityBadge priority={email.priority} />
        <Link href={`/assistant?replyTo=${email.id}`} className="ml-auto inline-flex h-8 items-center gap-2 rounded-md border bg-card px-3 text-sm font-medium">
          <Reply className="h-4 w-4" />Reply
        </Link>
      </div>
      {email.summary ? (
        <Card className="border-accent/40">
          <CardHeader><CardTitle>Email Summary</CardTitle></CardHeader>
          <CardContent><p className="whitespace-pre-line text-sm leading-6">{email.summary}</p></CardContent>
        </Card>
      ) : null}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">From {email.sender} to {email.recipient}</CardTitle>
        </CardHeader>
        <CardContent>
          <article className="whitespace-pre-wrap leading-7">{email.body}</article>
        </CardContent>
      </Card>
    </div>
  );
}
