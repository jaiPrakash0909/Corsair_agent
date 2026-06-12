import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  guests: z.array(z.string().email()).default([])
});

export const updateEventSchema = createEventSchema.partial().extend({
  eventId: z.string().min(1)
});

export const deleteEventSchema = z.object({
  eventId: z.string().min(1)
});
