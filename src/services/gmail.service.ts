import { EmailPriority } from "@prisma/client";
import { getCorsairTenant } from "@/lib/corsair";
import { classifyEmail, summarizeEmail } from "@/lib/ai";
import { emailRepository } from "@/repositories/email.repository";
import { pickText, runFirstAvailable } from "@/services/corsair-runner";

const messageListPaths = [
  ["gmail", "db", "messages", "search"],
  ["gmail", "api", "messages", "list"],
  ["gmail", "api", "emails", "list"]
];

export const gmailService = {
  async syncEmails(userId: string, query = "") {
    const tenant = getCorsairTenant(userId);
    const messages = (await runFirstAvailable(tenant as any, messageListPaths, { query, limit: 50 })) as any[];

    return Promise.all(
      messages.map(async (message) => {
        const data = message.data ?? message;
        const body = pickText(data, ["body", "text", "snippet", "plainText"]);
        const subject = pickText(data, ["subject"]) || "(No subject)";
        const priority = (await classifyEmail(body, subject)) as EmailPriority;
        const summary = body.length > 700 ? await summarizeEmail(body) : undefined;

        return emailRepository.upsertFromCorsair({
          userId,
          gmailId: String(data.id ?? data.messageId ?? data.entity_id),
          sender: pickText(data, ["from", "sender"]) || "unknown",
          recipient: pickText(data, ["to", "recipient"]) || "",
          subject,
          body,
          summary,
          priority,
          createdAt: data.date ? new Date(data.date) : undefined
        });
      })
    );
  },
  async listEmails(userId: string, input?: { query?: string; priority?: EmailPriority }) {
    await this.syncEmails(userId, input?.query ?? "");
    return emailRepository.list(userId, input);
  },
  async getEmail(userId: string, id: string) {
    const email = await emailRepository.get(userId, id);
    if (!email) {
      return null;
    }
    if (!email.summary && email.body.length > 700) {
      const summary = await summarizeEmail(email.body);
      await emailRepository.upsertFromCorsair({ ...email, summary });
      return { ...email, summary };
    }
    return email;
  },
  async sendEmail(userId: string, input: { to: string; subject: string; body: string }) {
    const tenant = getCorsairTenant(userId);
    const sent = await runFirstAvailable(
      tenant as any,
      [
        ["gmail", "api", "messages", "send"],
        ["gmail", "api", "messages", "post"],
        ["gmail", "api", "emails", "send"]
      ],
      input
    );

    await emailRepository.upsertFromCorsair({
      userId,
      gmailId: String((sent as any)?.id ?? (sent as any)?.messageId ?? crypto.randomUUID()),
      sender: "me",
      recipient: input.to,
      subject: input.subject,
      body: input.body,
      priority: "NORMAL"
    });

    return sent;
  },
  starEmail(userId: string, id: string, starred: boolean) {
    return emailRepository.star(userId, id, starred);
  },
  archiveEmail(userId: string, id: string) {
    return emailRepository.archive(userId, id);
  }
};
