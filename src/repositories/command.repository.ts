import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const commandRepository = {
  create(input: { userId: string; prompt: string; result: Prisma.InputJsonValue }) {
    return prisma.commandHistory.create({ data: input });
  },
  recent(userId: string, take = 10) {
    return prisma.commandHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take
    });
  }
};
