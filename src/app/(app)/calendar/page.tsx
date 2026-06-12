import { CalendarPlus } from "lucide-react";
import { auth } from "@/lib/auth";
import { calendarService } from "@/services/calendar.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreateEventForm } from "@/features/calendar/create-event-form";

export default async function CalendarPage() {
  const session = await auth();
  const events = await calendarService.listEvents(session!.user!.id);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold">Calendar</h1>
          <Button size="sm" className="ml-auto"><CalendarPlus className="h-4 w-4" />Create Event</Button>
        </div>
        <Card>
          <CardHeader><CardTitle>Week View</CardTitle></CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-7">
            {days.map((day) => (
              <div key={day} className="min-h-48 rounded-md border p-3">
                <div className="mb-3 text-xs font-medium text-muted-foreground">{day}</div>
                {events.filter((event) => event.startTime.toLocaleDateString("en-US", { weekday: "short" }) === day).map((event) => (
                  <div key={event.id} className="mb-2 rounded-md bg-accent/10 p-2 text-xs">
                    <div className="font-medium">{event.title}</div>
                    <div className="text-muted-foreground">{event.startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                  </div>
                ))}
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Upcoming Events</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {events.map((event) => (
              <div key={event.id} className="rounded-md border p-3">
                <div className="font-medium">{event.title}</div>
                <div className="text-sm text-muted-foreground">{event.startTime.toLocaleString()} - {event.endTime.toLocaleTimeString()}</div>
                {event.description ? <p className="mt-2 text-sm">{event.description}</p> : null}
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
      <CreateEventForm />
    </div>
  );
}
