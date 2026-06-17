import { z } from "zod";

export const aiActionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("send_email"),
    to: z.string().nullable().optional(),
    subject: z.string().min(1),
    body: z.string().min(1)
  }),
  z.object({
    type: z.literal("create_event"),
    title: z.string().min(1),
    description: z.string().optional(),
    startTime: z.string().datetime(),
    endTime: z.string().datetime(),
    guests: z.array(z.string().email()).default([])
  }),
  z.object({
    type: z.literal("update_event"),
    eventId: z.string().min(1),
    title: z.string().optional(),
    description: z.string().optional(),
    startTime: z.string().datetime().optional(),
    endTime: z.string().datetime().optional()
  }),
  z.object({
    type: z.literal("delete_event"),
    eventId: z.string().min(1)
  }),
  z.object({
    type: z.literal("search"),
    query: z.string().min(1)
  })
]);

export const aiCommandSchema = z.object({
  actions: z.array(aiActionSchema).min(1)
});

export type AiCommand = z.infer<typeof aiCommandSchema>;
export type AiAction = z.infer<typeof aiActionSchema>;


// **
const systemPrompt = `
You are Corsair Agent AI.

Return VALID JSON ONLY.

For send_email:

{
   "type":"send_email",
  "to":"actual recipient email or null",
  "subject":"meaningful email subject",
  "body":"full email body text"
}

IMPORTANT RULES:

- Generate a real subject.
- Generate a complete professional email body.
- Never use "..." as subject or body.
- Never leave subject empty.
- Never leave body empty.
- Never invent email addresses.
- If the user does not provide an email address, set "to": null.

For create_event use:

{
  "type":"create_event",
  "title":"...",
  "description":"...",
  "startTime":"ISO_DATE",
  "endTime":"ISO_DATE",
  "guests":[]
}

Return:
{"actions":[...]}
`;

//v****

// const systemPrompt = `You are Corsair Agent AI. Convert the user's request into strict JSON only.
// Return {"actions":[...]}.
// Use ISO datetimes with timezone when scheduling. For missing email subject/body, create concise professional text.
// Supported action types: send_email, create_event, update_event, delete_event, search.`;

// ****



async function callOpenAI(prompt: string) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed with ${response.status}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  return data.choices?.[0]?.message?.content ?? "";
}

async function callGemini(prompt: string) {
  const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        generationConfig: { responseMimeType: "application/json" },
        contents: [
          {
            role: "user",
            parts: [{ text: `${systemPrompt}\n\nUser: ${prompt}` }]
          }
        ]
      })
    }
  );


  //*** */

if (!response.ok) {
  const errorText = await response.text();

  console.log("===== GEMINI ERROR =====");
  console.log(errorText);
  console.log("========================");

  throw new Error(`Gemini request failed with ${response.status}`);
}
// *****
  // if (!response.ok) {
  //   throw new Error(`Gemini request failed with ${response.status}`);
  // }

// ***


  const data = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };

  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

// ****
export async function parseCommand(prompt: string): Promise<AiCommand> {
  const provider = process.env.AI_PROVIDER ?? "openai";

  const raw = provider === "gemini"
    ? await callGemini(prompt)
    : await callOpenAI(prompt);

  console.log("========== AI RAW RESPONSE ==========");
  console.log(raw);
  console.log("====================================");


  // ***
const parsed = JSON.parse(raw);

for (const action of parsed.actions ?? []) {

  if (action.type === "create_event") {
    action.title =
      action.title ??
      action.summary ??
      action.subject;

    action.startTime =
      action.startTime ??
      action.start_time;

    action.endTime =
      action.endTime ??
      action.end_time;

    action.guests =
      action.guests ??
      action.attendees ??
      [];
  }

  if (action.type === "send_email") {
    
    if (Array.isArray(action.to)) {
    action.to = action.to[0];
  }
    if (action.subject === "...") {
  action.subject = "Generated Email";
}

if (action.body === "...") {
  action.body =
    "Hello,\n\nI hope you are doing well.\n\nThank you.\n";
}

if (
  typeof action.to === "string" &&
  action.to.endsWith("@example.com")
) {
  action.to = null;
}
  }
}

return aiCommandSchema.parse(parsed);
  // **
  // const parsed = JSON.parse(raw);

  // return aiCommandSchema.parse(parsed);

  //** */
}

// ****
// export async function parseCommand(prompt: string): Promise<AiCommand> {
//   const provider = process.env.AI_PROVIDER ?? "openai";

//   const raw = provider === "gemini" ? await callGemini(prompt) : await callOpenAI(prompt);
//   const parsed = JSON.parse(raw);
//   return aiCommandSchema.parse(parsed);
// }
// ***





export async function summarizeEmail(body: string): Promise<string> {
  if (body.length < 700) {
    return body;
  }

  const raw = await (process.env.AI_PROVIDER === "gemini"
    ? callGemini(`Summarize this email as 3 short bullet lines:\n\n${body}`)
    : callOpenAI(`Summarize this email as 3 short bullet lines:\n\n${body}`));

  try {
    const parsed = JSON.parse(raw) as { summary?: string };
    return parsed.summary ?? raw;
  } catch {
    return raw;
  }
}

export async function classifyEmail(body: string, subject: string) {
  const raw = await (process.env.AI_PROVIDER === "gemini"
    ? callGemini(`Classify this email priority as URGENT, IMPORTANT, or NORMAL. Return {"priority":"..."}.\nSubject: ${subject}\n${body}`)
    : callOpenAI(`Classify this email priority as URGENT, IMPORTANT, or NORMAL. Return {"priority":"..."}.\nSubject: ${subject}\n${body}`));

  const parsed = JSON.parse(raw) as { priority?: string };
  if (parsed.priority === "URGENT" || parsed.priority === "IMPORTANT") {
    return parsed.priority;
  }
  return "NORMAL";
}
