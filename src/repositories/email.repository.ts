import { EmailPriority, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const emailRepository = {
  upsertFromCorsair(input: {
    userId: string;
    gmailId: string;
    sender: string;
    recipient: string;
    subject: string;
    body: string;
    summary?: string;
    priority?: EmailPriority;
    createdAt?: Date;
  }) {
    return prisma.email.upsert({
      where: { userId_gmailId: { userId: input.userId, gmailId: input.gmailId } },
      update: {
        sender: input.sender,
        recipient: input.recipient,
        subject: input.subject,
        body: input.body,
        summary: input.summary,
        priority: input.priority ?? "NORMAL"
      },
      create: {
        userId: input.userId,
        gmailId: input.gmailId,
        sender: input.sender,
        recipient: input.recipient,
        subject: input.subject,
        body: input.body,
        summary: input.summary,
        priority: input.priority ?? "NORMAL",
        createdAt: input.createdAt
      }
    });
  },
  list(userId: string, options?: { query?: string; priority?: EmailPriority }) {
    const where: Prisma.EmailWhereInput = {
      userId,
      archived: false,
      ...(options?.priority ? { priority: options.priority } : {}),
      ...(options?.query
        ? {
            OR: [
              { subject: { contains: options.query, mode: "insensitive" } },
              { sender: { contains: options.query, mode: "insensitive" } },
              { body: { contains: options.query, mode: "insensitive" } }
            ]
          }
        : {})
    };

    return prisma.email.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 50
    });
  },
  get(userId: string, id: string) {
    return prisma.email.findFirst({ where: { userId, id } });
  },
  counts(userId: string) {
    return prisma.$transaction([
      prisma.email.count({ where: { userId, archived: false } }),
      prisma.email.count({ where: { userId, priority: "URGENT", archived: false } }),
      prisma.email.count({ where: { userId, priority: "IMPORTANT", archived: false } })
    ]);
  },
  star(userId: string, id: string, starred: boolean) {
    return prisma.email.updateMany({ where: { userId, id }, data: { starred } });
  },
  archive(userId: string, id: string) {
    return prisma.email.updateMany({ where: { userId, id }, data: { archived: true } });
  }
};
