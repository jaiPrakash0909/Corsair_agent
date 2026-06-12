import { auth } from "@/lib/auth";
import { apiError, requireUserId } from "@/lib/utils";
import { aiService } from "@/services/ai.service";
import { promptSchema } from "@/validators/ai";

export async function POST(request: Request) {
  try {
    const session = await auth();
    const userId = requireUserId(session?.user?.id);
    const input = promptSchema.parse(await request.json());
    return Response.json(await aiService.runCommand(userId, input.prompt));
  } catch (error) {
    return apiError(error);
  }
}
