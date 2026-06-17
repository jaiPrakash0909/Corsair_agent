import { CalendarView } from "@/features/calendar/calendar-view";

import { CalendarPlus, Clock, CalendarDays } from "lucide-react";
import { auth } from "@/lib/auth";
import { calendarService } from "@/services/calendar.service";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreateEventForm } from "@/features/calendar/create-event-form";

export default async function CalendarPage() {
const session = await auth();
const events = await calendarService.listEvents(session!.user!.id);

return ( <div className="space-y-6">
{/* Header */} <div className="flex items-center justify-between"> <div> <h1 className="text-3xl font-bold">Calendar</h1> <p className="text-zinc-500">
Manage meetings and schedules </p> </div>

    <Button className="rounded-xl bg-[#127173]">
      <CalendarPlus className="mr-2 h-4 w-4" />
      New Event
    </Button>
  </div>

  {/* Calendar Area */}

  <CalendarView events={events} />

  {/* Bottom Section */}
  <div className="grid gap-6 lg:grid-cols-2">
    <Card className="rounded-3xl border-zinc-800 bg-zinc-950/70">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-4 w-4 text-[#127173]" />
          <h3 className="font-semibold">Today's Schedule</h3>
        </div>

        <div className="space-y-3">
          {events.slice(0, 5).map((event) => (
            <div
              key={event.id}
              className="rounded-xl border border-zinc-800 p-3"
            >
              <div className="font-medium">{event.title}</div>
              <div className="text-sm text-zinc-500">
                {event.startTime.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    <Card className="rounded-3xl border-zinc-800 bg-zinc-950/70">
      <CardContent className="p-6">
        <h3 className="mb-4 font-semibold">
          Upcoming Events
        </h3>

        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="rounded-xl border border-zinc-800 p-3"
            >
              <div className="font-medium">{event.title}</div>

              <div className="text-sm text-zinc-500">
                {event.startTime.toLocaleString()}
              </div>

              {event.description && (
                <p className="mt-2 text-sm text-zinc-400">
                  {event.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>

  <CreateEventForm />
</div>


);
}




