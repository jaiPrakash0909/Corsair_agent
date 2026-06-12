import { auth } from "@/lib/auth";
import { apiError, requireUserId } from "@/lib/utils";
import { searchService } from "@/services/search.service";

export async function GET(request: Request) {
  try {
    const session = await auth();
    const userId = requireUserId(session?.user?.id);
    const url = new URL(request.url);
    const query = url.searchParams.get("q") ?? "";
    if (query.length < 2) {
      return Response.json({ emails: [], events: [] });
    }
    return Response.json(await searchService.global(userId, query));
  } catch (error) {
    return apiError(error);
  }
}
