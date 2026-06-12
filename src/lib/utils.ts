import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function apiError(error: unknown, fallback = "Request failed") {
  const message = error instanceof Error ? error.message : fallback;
  return Response.json({ error: message }, { status: 500 });
}

export function requireUserId(id?: string) {
  if (!id) {
    throw new Error("Authentication required");
  }
  return id;
}
