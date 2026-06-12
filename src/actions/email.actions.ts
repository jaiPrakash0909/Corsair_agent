"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { requireUserId } from "@/lib/utils";
import { gmailService } from "@/services/gmail.service";

export async function archiveEmailAction(id: string) {
  const session = await auth();
  await gmailService.archiveEmail(requireUserId(session?.user?.id), id);
  revalidatePath("/inbox");
}

export async function starEmailAction(id: string, starred: boolean) {
  const session = await auth();
  await gmailService.starEmail(requireUserId(session?.user?.id), id, starred);
  revalidatePath("/inbox");
}
