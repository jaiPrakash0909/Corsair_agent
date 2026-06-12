import { z } from "zod";

export const promptSchema = z.object({
  prompt: z.string().min(2).max(2000)
});
