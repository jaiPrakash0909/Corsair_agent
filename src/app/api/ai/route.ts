import { auth } from "@/lib/auth";
import { requireUserId } from "@/lib/utils";
import { aiService } from "@/services/ai.service";
import { promptSchema } from "@/validators/ai";

export async function POST(request: Request) {
  try {
    const session = await auth();

    const userId = requireUserId(
      session?.user?.id
    );

    const input = promptSchema.parse(
      await request.json()
    );

    const result = await aiService.runCommand(
      userId,
      input.prompt
    );

    return Response.json(result);
  } catch (error) {
    console.error("===== API AI ERROR =====");
    console.error(error);

    return Response.json(
      {
        error: String(error),
      },
      {
        status: 500,
      }
    );
  }
}





// import { auth } from "@/lib/auth";
// import { apiError, requireUserId } from "@/lib/utils";
// import { aiService } from "@/services/ai.service";
// import { promptSchema } from "@/validators/ai";

// export async function POST(request: Request) {
//   try {
//     const session = await auth();
//     const userId = requireUserId(session?.user?.id);
//     const input = promptSchema.parse(await request.json());
//     return Response.json(await aiService.runCommand(userId, input.prompt));
//   } catch (error) {
//     return apiError(error);
//   }
// }
