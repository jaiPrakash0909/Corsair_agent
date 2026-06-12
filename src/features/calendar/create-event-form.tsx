"use client";

import { CalendarPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function CreateEventForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [guests, setGuests] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/calendar/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        guests: guests.split(",").map((guest) => guest.trim()).filter(Boolean)
      })
    });
    const body = await response.json();
    if (!response.ok) {
      toast.error(body.error ?? "Unable to create event");
      return;
    }
    toast.success("Event created");
    setTitle("");
    setDescription("");
    setStartTime("");
    setEndTime("");
    setGuests("");
  }

  return (
    <Card>
      <CardHeader><CardTitle>Create Event</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-3">
          <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Title" required />
          <Textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Description" />
          <Input value={startTime} onChange={(event) => setStartTime(event.target.value)} type="datetime-local" required />
          <Input value={endTime} onChange={(event) => setEndTime(event.target.value)} type="datetime-local" required />
          <Input value={guests} onChange={(event) => setGuests(event.target.value)} placeholder="Guests, comma separated" />
          <Button className="w-full" type="submit"><CalendarPlus className="h-4 w-4" />Create</Button>
        </form>
      </CardContent>
    </Card>
  );
}
