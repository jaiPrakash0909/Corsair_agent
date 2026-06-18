import { parseCommand, type AiAction } from "@/lib/ai";
import { calendarService } from "@/services/calendar.service";
import { gmailService } from "@/services/gmail.service";
import { searchService } from "@/services/search.service";
import { commandRepository } from "@/repositories/command.repository";
import { chatService } from "@/services/chat.service";
import { detectIntent } from "@/services/intent.service";


async function executeAction(userId: string, action: AiAction) {
  if (action.type === "send_email") {
  if (!action.to) {
    return {
      needInput: true,
      message: "What is the recipient's email address?"
    };
  }

  return gmailService.sendEmail(userId, {
    to: action.to,
    subject: action.subject,
    body: action.body
  });
}
  if (action.type === "create_event") {
    return calendarService.createEvent(userId, action);
  }
  if (action.type === "update_event") {
    return calendarService.updateEvent(userId, action);
  }
  if (action.type === "delete_event") {
    return calendarService.deleteEvent(userId, action.eventId);
  }
  return searchService.global(userId, action.query);
}

export const aiService = {
  async runCommand(userId: string, prompt: string) {



  const intent = detectIntent(prompt);

  

if (intent === "search") {
  const query = prompt.toLowerCase();

const result = await searchService.global(
  userId,
  query
);

   return {
    message: "Search completed",
    searchResults: result,
  };


  // return {
  //   message: `Found ${result.emails.length} emails and ${result.events.length} events.`,
  //   searchResults: result,
  // };
}


  if (intent === "chat") {
    const message = await chatService.chat(prompt);

    const saved = await commandRepository.create({
      userId,
      prompt,
      result: { message },
    });

    return {
      message,
      historyId: saved.id,
    };
    
  }






if (
  prompt.toLowerCase().includes("schedule") ||
  prompt.toLowerCase().includes("meeting")
) {

  const tomorrow = new Date();

  tomorrow.setDate(
    tomorrow.getDate() + 1
  );

  tomorrow.setHours(16, 0, 0, 0);

  return {
    message:
      "Meeting scheduled successfully.",
    results: [
      await calendarService.createEvent(
        userId,
        {
          title: "Meeting",
          description: "Scheduled by AI",
          startTime:
            tomorrow.toISOString(),
          endTime: new Date(
            tomorrow.getTime() +
              60 * 60 * 1000
          ).toISOString(),
          guests: [],
        }
      ),
    ],
  };
}






  const command = await parseCommand(prompt);
  

  console.log("COMMAND =====");




for (const action of command.actions) {
  if (action.type === "create_event") {

    const start = new Date(action.startTime);

    if (start.getFullYear() < 2026) {

      const tomorrow = new Date();

      tomorrow.setDate(
        tomorrow.getDate() + 1
      );

      tomorrow.setHours(2, 0, 0, 0);

      action.startTime =
        tomorrow.toISOString();

      const end = new Date(tomorrow);

      end.setHours(3);

      action.endTime =
        end.toISOString();
    }
  }
}
  










  for (const action of command.actions) {
  if (action.type === "create_event") {

    const start = new Date(action.startTime);

    if (start < new Date()) {
      throw new Error(
        "AI generated a past date. Please try again."
      );
    }
  }
}
console.log(JSON.stringify(command, null, 2));
console.log("=============");



  // const results = [];

  // for (const action of command.actions) {
  //   results.push({
  //     action,
  //     result: await executeAction(userId, action),
  //   });
  // }


const results = [];

for (const action of command.actions) {
  const result = await executeAction(userId, action);

  if ((result as any)?.needInput) {
    return {
      message: (result as any).message,
    };
  }

  results.push({
    action,
    result,
  });
}


  const saved = await commandRepository.create({
    userId,
    prompt,
    result: {
      actions: command.actions,
      results,
    },
  });

  // return {
  //   message: `Executed ${command.actions.length} action(s).`,
  //   command,
  //   results,
  //   historyId: saved.id,
  // };


return {
  message: "Action completed successfully.",
  command,
  results,
  historyId: saved.id,
};

}







  // async runCommand(userId: string, prompt: string) {
  //   const command = await parseCommand(prompt);
  //   const results = [];

  //   for (const action of command.actions) {
  //     results.push({ action, result: await executeAction(userId, action) });
  //   }

  //   const saved = await commandRepository.create({
  //     userId,
  //     prompt,
  //     result: { actions: command.actions, results }
  //   });

  //   return { command, results, historyId: saved.id };
  // }
};
