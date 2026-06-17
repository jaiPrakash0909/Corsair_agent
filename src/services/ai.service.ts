import { parseCommand, type AiAction } from "@/lib/ai";
import { calendarService } from "@/services/calendar.service";
import { gmailService } from "@/services/gmail.service";
import { searchService } from "@/services/search.service";
import { commandRepository } from "@/repositories/command.repository";
import { chatService } from "@/services/chat.service";
import { detectIntent } from "@/services/intent.service";


async function executeAction(userId: string, action: AiAction) {
  if (action.type === "send_email") {
    return gmailService.sendEmail(userId, action);
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

  const command = await parseCommand(prompt);

  const results = [];

  for (const action of command.actions) {
    results.push({
      action,
      result: await executeAction(userId, action),
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

  return {
    message: `Executed ${command.actions.length} action(s).`,
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
