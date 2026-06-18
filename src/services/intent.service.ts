export function detectIntent(prompt: string) {
  const text = prompt.toLowerCase();

  if (
    text.includes("send email") ||
    text.includes("schedule") ||
    text.includes("meeting") ||
    text.includes("calendar") ||
    text.includes("event")
  ) {
    return "action";
  }

  if (
    text.includes("email") ||
    text.includes("emails")
  ) {
    return "search";
  }

  return "chat";
}

