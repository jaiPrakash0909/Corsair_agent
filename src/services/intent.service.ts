export function detectIntent(prompt: string) {
  const text = prompt.toLowerCase();

  const actionKeywords = [
    "email",
    "mail",
    "meeting",
    "calendar",
    "schedule",
    "event",
    "send",
    "reply",
    "invite",
    "delete event",
    "update event",
  ];

  const isAction = actionKeywords.some((keyword) =>
    text.includes(keyword)
  );

  return isAction ? "action" : "chat";
}