"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const { data } = useQuery({
    queryKey: ["search", query],
    queryFn: async () => {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error("Search failed");
      return response.json() as Promise<{ emails: Array<{ id: string; subject: string }>; events: Array<{ id: string; title: string }> }>;
    },
    enabled: query.length > 1
  });

  return (
    <div className="relative w-full max-w-xl">
      <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search emails and events" className="h-9" />
      {query.length > 1 && data ? (
        <div className="absolute top-11 z-30 w-full rounded-lg border bg-card p-2 shadow-xl">
          {[...data.emails.map((email) => ({ href: `/email/${email.id}`, label: email.subject, type: "Email" })), ...data.events.map((event) => ({ href: "/calendar", label: event.title, type: "Event" }))].slice(0, 6).map((item) => (
            <Link key={`${item.type}-${item.label}`} href={item.href} className="block rounded-md px-3 py-2 text-sm hover:bg-muted" onClick={() => setQuery("")}>
              <span className="mr-2 text-xs text-muted-foreground">{item.type}</span>
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
