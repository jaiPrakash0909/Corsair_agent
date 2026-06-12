import { auth } from "@/lib/auth";
import { apiError, requireUserId } from "@/lib/utils";
import { calendarService } from "@/services/calendar.service";
import { createEventSchema } from "@/validators/calendar";

export async function POST(request: Request) {
  try {
    const session = await auth();
    const userId = requireUserId(session?.user?.id);
    const input = createEventSchema.parse(await request.json());
    return Response.json(await calendarService.createEvent(userId, input));
  } catch (error) {
    return apiError(error);
  }
}
