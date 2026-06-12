import { auth } from "@/lib/auth";
import { apiError, requireUserId } from "@/lib/utils";
import { gmailService } from "@/services/gmail.service";
import { sendEmailSchema } from "@/validators/email";

export async function POST(request: Request) {
  try {
    const session = await auth();
    const userId = requireUserId(session?.user?.id);
    const input = sendEmailSchema.parse(await request.json());
    return Response.json(await gmailService.sendEmail(userId, input));
  } catch (error) {
    return apiError(error);
  }
}
