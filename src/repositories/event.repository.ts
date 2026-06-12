import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const eventRepository = {
  upsertFromCorsair(input: {
    userId: string;
    calendarEventId: string;
    title: string;
    description?: string;
    startTime: Date;
    endTime: Date;
  }) {
    return prisma.event.upsert({
      where: {
        userId_calendarEventId: {
          userId: input.userId,
          calendarEventId: input.calendarEventId
        }
      },
      update: {
        title: input.title,
        description: input.description,
        startTime: input.startTime,
        endTime: input.endTime
      },
      create: input
    });
  },
  list(userId: string, range?: { from?: Date; to?: Date }) {
    const where: Prisma.EventWhereInput = {
      userId,
      ...(range?.from || range?.to
        ? {
            startTime: {
              ...(range.from ? { gte: range.from } : {}),
              ...(range.to ? { lte: range.to } : {})
            }
          }
        : {})
    };

    return prisma.event.findMany({
      where,
      orderBy: { startTime: "asc" },
      take: 100
    });
  },
  upcoming(userId: string, take = 5) {
    return prisma.event.findMany({
      where: { userId, startTime: { gte: new Date() } },
      orderBy: { startTime: "asc" },
      take
    });
  },
  todaysCount(userId: string) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    return prisma.event.count({
      where: { userId, startTime: { gte: start, lt: end } }
    });
  },
  deleteLocal(userId: string, calendarEventId: string) {
    return prisma.event.deleteMany({ where: { userId, calendarEventId } });
  }
};
