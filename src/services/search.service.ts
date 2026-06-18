import { emailRepository } from "@/repositories/email.repository";
import { eventRepository } from "@/repositories/event.repository";

export const searchService = {
  async global(userId: string, query: string) {

const text = query.toLowerCase();

  // latest emails
  if (
    text.includes("latest email")
  ) {
    const emails = await emailRepository.list(userId);

    return {
      emails: emails.slice(0, 2),
      events: [],
    };}


    const [emails, events] = await Promise.all([
  query
    ? emailRepository.list(userId, { query })
    : emailRepository.list(userId),
  eventRepository.list(userId)
]);

    const normalizedQuery =
  query?.toLowerCase() ?? "";
    const filteredEvents = events.filter((event) => {
      return (
        event.title.toLowerCase().includes(normalizedQuery) ||
        event.description?.toLowerCase().includes(normalizedQuery)
      );
    });

    return { emails, events: filteredEvents };
  }
};
