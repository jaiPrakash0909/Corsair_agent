import { EmailPriority } from "@prisma/client";
import { ensureCorsairTenantSetup, getCorsairTenant } from "@/lib/corsair";
import { classifyEmail, summarizeEmail } from "@/lib/ai";
import { emailRepository } from "@/repositories/email.repository";
import { pickText, runFirstAvailable } from "@/services/corsair-runner";

const messageListPaths = [
  ["gmail", "api", "messages", "list"]
];

function toArray<T = any>(value: any): T[] {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.messages)) return value.messages;
  if (Array.isArray(value?.data?.messages)) return value.data.messages;
  if (Array.isArray(value?.data)) return value.data;
  return [];
}

function getHeader(message: any, name: string) {
  const headers = message?.payload?.headers;
  if (!Array.isArray(headers)) return "";
  return headers.find((header) => header?.name?.toLowerCase() === name.toLowerCase())?.value ?? "";
}

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  return Buffer.from(padded, "base64").toString("utf8");
}

function extractBody(part: any): string {
  if (!part) return "";
  if (part.body?.data) {
    try {
      return decodeBase64Url(part.body.data);
    } catch {
      return "";
    }
  }

  if (!Array.isArray(part.parts)) return "";
  const plain = part.parts.find((child: any) => child?.mimeType === "text/plain");
  const html = part.parts.find((child: any) => child?.mimeType === "text/html");
  return extractBody(plain) || extractBody(html) || part.parts.map(extractBody).find(Boolean) || "";
}

function buildRawEmail(input: { to: string; subject: string; body: string }) {
  const message = [
    `To: ${input.to}`,
    `Subject: ${input.subject}`,
    "Content-Type: text/plain; charset=utf-8",
    "MIME-Version: 1.0",
    "",
    input.body
  ].join("\r\n");

  return Buffer.from(message, "utf8").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function getFullMessage(tenant: any, message: any) {
  const data = message.data ?? message;
  const id = data.id ?? data.messageId ?? data.entity_id;
  if (!id || data.body || data.payload?.body || data.payload?.parts) {
    return data;
  }

  try {
    return await tenant.gmail.api.messages.get({ id: String(id), format: "full" });
  } catch {
    return data;
  }
}

export const gmailService = {
  async syncEmails(userId: string, query = "") {
    await ensureCorsairTenantSetup(userId);
    const tenant = getCorsairTenant(userId);
    const response = await runFirstAvailable(tenant as any, messageListPaths, {
      q: query || undefined,
      maxResults: 50
    });
    const messages = toArray(response);

    return Promise.all(
      messages.map(async (message: any) => {
        const data = await getFullMessage(tenant as any, message);
        const body = pickText(data, ["body", "text", "plainText"]) || extractBody(data.payload) || pickText(data, ["snippet"]);
        const subject = pickText(data, ["subject"]) || getHeader(data, "Subject") || "(No subject)";
        const priority = (await classifyEmail(body, subject)) as EmailPriority;
        const summary = body.length > 700 ? await summarizeEmail(body) : undefined;

        return emailRepository.upsertFromCorsair({
          userId,
          gmailId: String(data.id ?? data.messageId ?? data.entity_id),
          sender: pickText(data, ["from", "sender"]) || getHeader(data, "From") || "unknown",
          recipient: pickText(data, ["to", "recipient"]) || getHeader(data, "To") || "",
          subject,
          body,
          summary,
          priority,
          createdAt: data.internalDate ? new Date(Number(data.internalDate)) : data.date ? new Date(data.date) : undefined
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
    await ensureCorsairTenantSetup(userId);
    const tenant = getCorsairTenant(userId);
    const sent = await runFirstAvailable(
      tenant as any,
      [
        ["gmail", "api", "messages", "send"]
      ],
      { raw: buildRawEmail(input) }
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
