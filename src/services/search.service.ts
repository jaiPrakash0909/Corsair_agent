import { emailRepository } from "@/repositories/email.repository";
import { eventRepository } from "@/repositories/event.repository";

export const searchService = {
  async global(userId: string, query: string) {
    const [emails, events] = await Promise.all([
      emailRepository.list(userId, { query }),
      eventRepository.list(userId)
    ]);

    const normalizedQuery = query.toLowerCase();
    const filteredEvents = events.filter((event) => {
      return (
        event.title.toLowerCase().includes(normalizedQuery) ||
        event.description?.toLowerCase().includes(normalizedQuery)
      );
    });

    return { emails, events: filteredEvents };
  }
};
