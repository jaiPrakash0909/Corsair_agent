"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { requireUserId } from "@/lib/utils";
import { calendarService } from "@/services/calendar.service";
import { createEventSchema } from "@/validators/calendar";

export async function createEventAction(formData: FormData) {
  const session = await auth();
  const input = createEventSchema.parse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    startTime: new Date(String(formData.get("startTime"))).toISOString(),
    endTime: new Date(String(formData.get("endTime"))).toISOString(),
    guests: String(formData.get("guests") ?? "")
      .split(",")
      .map((guest) => guest.trim())
      .filter(Boolean)
  });
  await calendarService.createEvent(requireUserId(session?.user?.id), input);
  revalidatePath("/calendar");
}
