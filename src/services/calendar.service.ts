import { addDays } from "date-fns";
import { ensureCorsairTenantSetup, getCorsairTenant } from "@/lib/corsair";
import { eventRepository } from "@/repositories/event.repository";
import { runFirstAvailable } from "@/services/corsair-runner";

const eventListPaths = [
  ["googlecalendar", "api", "events", "getMany"]
];

function toArray<T = any>(value: any): T[] {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value?.data?.items)) return value.data.items;
  if (Array.isArray(value?.data)) return value.data;
  return [];
}

function eventStart(event: any) {
  return event.startTime ?? event.start?.dateTime ?? event.start?.date;
}

function eventEnd(event: any) {
  return event.endTime ?? event.end?.dateTime ?? event.end?.date;
}

export const calendarService = {
  async syncEvents(userId: string) {
    await ensureCorsairTenantSetup(userId);
    const tenant = getCorsairTenant(userId) as any;
    const response = await runFirstAvailable(tenant, eventListPaths, {
      timeMin: new Date().toISOString(),
      timeMax: addDays(new Date(), 30).toISOString(),
      singleEvents: true,
      orderBy: "startTime",
      maxResults: 100
    });
    const events = toArray(response);

    return Promise.all(
      events.map((event) => {
        const data = event.data ?? event;
        return eventRepository.upsertFromCorsair({
          userId,
          calendarEventId: String(data.id ?? data.eventId ?? data.entity_id),
          title: String(data.title ?? data.summary ?? "Untitled event"),
          description: data.description,
          startTime: new Date(eventStart(data)),
          endTime: new Date(eventEnd(data))
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



    console.log("===== CREATE EVENT =====");
console.log("USER ID:", userId);
console.log("INPUT:", input);



    await ensureCorsairTenantSetup(userId);
    const tenant = getCorsairTenant(userId) as any;

console.log(
  "START ISO:",
  new Date(input.startTime).toISOString()
);

console.log(
  "END ISO:",
  new Date(input.endTime).toISOString()
);



console.log(
  "START ISO:",
  new Date(input.startTime).toISOString()
);

console.log(
  "END ISO:",
  new Date(input.endTime).toISOString()
);

  
let created;

try {
  created = await runFirstAvailable(
    tenant,
    [
      ["googleCalendar", "api", "events", "create"],
      ["googlecalendar", "api", "events", "create"]
    ],
    {
      calendarId: "primary",
      sendUpdates: "all",
      event: {
        summary: input.title,
        description: input.description,
        start: {
  dateTime: new Date(input.startTime).toISOString(),
},
end: {
  dateTime: new Date(input.endTime).toISOString(),
},
        attendees: input.guests.map((email) => ({ email }))
      }
    }
  );
} catch (error) {
  console.error("===== CREATE EVENT ERROR =====");
  console.error(error);
  throw error;
}



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
    await ensureCorsairTenantSetup(userId);
    const tenant = getCorsairTenant(userId) as any;
    const event = {
      ...(input.title ? { summary: input.title } : {}),
      ...(input.description ? { description: input.description } : {}),
      ...(input.startTime ? { start: { dateTime: input.startTime } } : {}),
      ...(input.endTime ? { end: { dateTime: input.endTime } } : {})
    };
    const updated = await runFirstAvailable(
      tenant,
      [
        ["googleCalendar", "api", "events", "update"],
        ["googlecalendar", "api", "events", "update"]
      ],
      {
        calendarId: "primary",
        id: input.eventId,
        sendUpdates: "all",
        event
      }
    );

    const data = (updated as any)?.data ?? updated;
    if (data?.id) {
      await eventRepository.upsertFromCorsair({
        userId,
        calendarEventId: String(data.id),
        title: String(data.summary ?? input.title ?? "Untitled event"),
        description: data.description ?? input.description,
        startTime: new Date(eventStart(data) ?? input.startTime),
        endTime: new Date(eventEnd(data) ?? input.endTime)
      });
    }

    return updated;
  },
  async deleteEvent(userId: string, eventId: string) {
    await ensureCorsairTenantSetup(userId);
    const tenant = getCorsairTenant(userId) as any;
    const deleted = await runFirstAvailable(
      tenant,
      [
        ["googleCalendar", "api", "events", "delete"],
        ["googlecalendar", "api", "events", "delete"]
      ],
      { calendarId: "primary", id: eventId, sendUpdates: "all" }
    );
    await eventRepository.deleteLocal(userId, eventId);
    return deleted;
  }
};
