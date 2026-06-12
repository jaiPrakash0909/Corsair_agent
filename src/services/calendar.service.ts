import { addDays } from "date-fns";
import { getCorsairTenant } from "@/lib/corsair";
import { eventRepository } from "@/repositories/event.repository";
import { runFirstAvailable } from "@/services/corsair-runner";

const eventListPaths = [
  ["googleCalendar", "db", "events", "search"],
  ["googlecalendar", "db", "events", "search"],
  ["calendar", "db", "events", "search"],
  ["googleCalendar", "api", "events", "list"],
  ["googlecalendar", "api", "events", "list"]
];

export const calendarService = {
  async syncEvents(userId: string) {
    const tenant = getCorsairTenant(userId) as any;
    const events = (await runFirstAvailable(tenant, eventListPaths, {
      timeMin: new Date().toISOString(),
      timeMax: addDays(new Date(), 30).toISOString()
    })) as any[];

    return Promise.all(
      events.map((event) => {
        const data = event.data ?? event;
        return eventRepository.upsertFromCorsair({
          userId,
          calendarEventId: String(data.id ?? data.eventId ?? data.entity_id),
          title: String(data.title ?? data.summary ?? "Untitled event"),
          description: data.description,
          startTime: new Date(data.startTime ?? data.start?.dateTime ?? data.start),
          endTime: new Date(data.endTime ?? data.end?.dateTime ?? data.end)
        });
      })
    );
  },
  async listEvents(userId: string) {
    await this.syncEvents(userId);
    return eventRepository.list(userId);
  },
  async createEvent(
    userId: string,
    input: { title: string; description?: string; startTime: string; endTime: string; guests: string[] }
  ) {
    const tenant = getCorsairTenant(userId) as any;
    const created = await runFirstAvailable(
      tenant,
      [
        ["googleCalendar", "api", "events", "create"],
        ["googlecalendar", "api", "events", "create"],
        ["calendar", "api", "events", "create"]
      ],
      {
        title: input.title,
        summary: input.title,
        description: input.description,
        startTime: input.startTime,
        endTime: input.endTime,
        attendees: input.guests
      }
    );

    const data = (created as any)?.data ?? created;
    await eventRepository.upsertFromCorsair({
      userId,
      calendarEventId: String(data?.id ?? data?.eventId ?? crypto.randomUUID()),
      title: input.title,
      description: input.description,
      startTime: new Date(input.startTime),
      endTime: new Date(input.endTime)
    });

    return created;
  },
  async updateEvent(userId: string, input: { eventId: string; title?: string; description?: string; startTime?: string; endTime?: string }) {
    const tenant = getCorsairTenant(userId) as any;
    return runFirstAvailable(
      tenant,
      [
        ["googleCalendar", "api", "events", "update"],
        ["googlecalendar", "api", "events", "update"],
        ["calendar", "api", "events", "update"]
      ],
      input
    );
  },
  async deleteEvent(userId: string, eventId: string) {
    const tenant = getCorsairTenant(userId) as any;
    const deleted = await runFirstAvailable(
      tenant,
      [
        ["googleCalendar", "api", "events", "delete"],
        ["googlecalendar", "api", "events", "delete"],
        ["calendar", "api", "events", "delete"]
      ],
      { eventId }
    );
    await eventRepository.deleteLocal(userId, eventId);
    return deleted;
  }
};
