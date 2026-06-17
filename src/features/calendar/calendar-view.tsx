"use client";

import { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";


const locales = {};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});




export function CalendarView({ events }: any) {
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const calendarEvents = events.map((event: any) => ({
    id: event.calendarEventId,
    title: event.title,
    start: new Date(event.startTime),
    end: new Date(event.endTime),
  }));



  

  return (
<>
<div className="h-[450px] w-full">
    <Calendar
      localizer={localizer}
      events={calendarEvents}
      startAccessor="start"
      endAccessor="end"
      defaultView="month"
      onSelectEvent={(event) => {
        setSelectedEvent(event);
        setOpen(true);
      }}
    />
  </div>

   {open && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
        <div className="w-[400px] rounded-xl bg-zinc-900 p-6 text-white">
          <h2 className="text-xl font-bold">
            {selectedEvent?.title}
          </h2>

          <div className="mt-4 space-y-2 text-sm">
  <p>
    <span className="font-semibold">Title:</span>{" "}
    {selectedEvent?.title}
  </p>

  <p>
    <span className="font-semibold">Start:</span>{" "}
    {selectedEvent?.start?.toLocaleString()}
  </p>

  <p>
    <span className="font-semibold">End:</span>{" "}
    {selectedEvent?.end?.toLocaleString()}
  </p>
</div>

{/* <pre className="mt-4 overflow-auto text-xs">
  {JSON.stringify(selectedEvent, null, 2)}
</pre>
 */}



<button
  className="mt-4 rounded bg-red-600 px-4 py-2 text-white"
  onClick={async () => {
    const response = await fetch(
      "/api/calendar/delete",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: selectedEvent.id,
        }),
      }
    );

    if (response.ok) {
      setOpen(false);
      window.location.reload();
    }
  }}
>
  Delete Event
</button>

          <button
            onClick={() => setOpen(false)}
            className="mt-4 rounded bg-red-500 px-4 py-2"
          >
            Close
          </button>
        </div>
      </div>
    )}
</>

  );
}
