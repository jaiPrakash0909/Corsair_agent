import { auth } from "@/lib/auth";
import { apiError, requireUserId } from "@/lib/utils";
import { gmailService } from "@/services/gmail.service";
import { emailSearchSchema } from "@/validators/email";

export async function GET(request: Request) {
  try {
    const session = await auth();
    const userId = requireUserId(session?.user?.id);
    const url = new URL(request.url);
    const input = emailSearchSchema.parse({
      query: url.searchParams.get("q") ?? "",
      priority: url.searchParams.get("priority") ?? undefined
    });
    return Response.json(await gmailService.listEmails(userId, input));
  } catch (error) {
    return apiError(error);
  }
}
