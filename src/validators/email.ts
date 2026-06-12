import { z } from "zod";

export const sendEmailSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1),
  body: z.string().min(1)
});

export const emailSearchSchema = z.object({
  query: z.string().default(""),
  priority: z.enum(["URGENT", "IMPORTANT", "NORMAL"]).optional()
});

export const emailMutationSchema = z.object({
  id: z.string().min(1)
});
