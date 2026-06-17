"use client";

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
  const calendarEvents = events.map((event: any) => ({
    title: event.title,
    start: new Date(event.startTime),
    end: new Date(event.endTime),
  }));

  return (
    <div className="h-[450px] w-full">
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        defaultView="month"
      />
    </div>
  );
}

