import { parseCommand, type AiAction } from "@/lib/ai";
import { calendarService } from "@/services/calendar.service";
import { gmailService } from "@/services/gmail.service";
import { searchService } from "@/services/search.service";
import { commandRepository } from "@/repositories/command.repository";

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
    const command = await parseCommand(prompt);
    const results = [];

    for (const action of command.actions) {
      results.push({ action, result: await executeAction(userId, action) });
    }

    const saved = await commandRepository.create({
      userId,
      prompt,
      result: { actions: command.actions, results }
    });

    return { command, results, historyId: saved.id };
  }
};
