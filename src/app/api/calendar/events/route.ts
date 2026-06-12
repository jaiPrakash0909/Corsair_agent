import { auth } from "@/lib/auth";
import { apiError, requireUserId } from "@/lib/utils";
import { calendarService } from "@/services/calendar.service";

export async function GET() {
  try {
    const session = await auth();
    const userId = requireUserId(session?.user?.id);
    return Response.json(await calendarService.listEvents(userId));
  } catch (error) {
    return apiError(error);
  }
}
