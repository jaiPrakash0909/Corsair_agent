# Corsair Agent

Corsair Agent AI is a premium, keyboard-first productivity workspace that combines Gmail and Google Calendar through Corsair.dev. Gmail and Calendar operations are intentionally routed through Corsair services only; the app does not call Gmail API or Google Calendar API directly.

## Stack

- Next.js 15 App Router, TypeScript, Tailwind CSS, shadcn-style components
- React Query, Zustand, Framer Motion, Sonner
- NextAuth Google login with Prisma sessions
- Prisma ORM and PostgreSQL
- Corsair SDK with Gmail and Google Calendar plugins
- OpenAI or Gemini command parsing

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment:

```bash
cp .env.example .env
```

Set `DATABASE_URL`, `AUTH_SECRET`, Google OAuth values, `CORSAIR_KEK`, and either OpenAI or Gemini credentials.

3. Create the database and app tables:

```bash
npm run db:migrate
```

4. Configure Corsair credentials for Gmail and Google Calendar. Corsair docs describe the core flow as installing `corsair`, providing a database and `CORSAIR_KEK`, then authenticating plugins through the Corsair CLI.

```bash
npx corsair auth --gmail
npx corsair auth --googlecalendar
```

5. Run the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Architecture

Key folders:

- `src/app`: App Router pages and route handlers
- `src/components`: Shared layout and UI primitives
- `src/features`: Product features such as assistant, command palette, inbox, calendar, and search
- `src/lib`: Prisma, Corsair, auth, AI, and utilities
- `src/repositories`: PostgreSQL persistence
- `src/services`: Corsair-backed Gmail, Calendar, AI, and Search orchestration
- `src/validators`: Zod schemas
- `src/actions`: Server actions

## Corsair Integration

`src/lib/corsair.ts` creates a multi-tenant Corsair instance:

```ts
createCorsair({
  multiTenancy: true,
  database: pool,
  kek: process.env.CORSAIR_KEK!,
  plugins: [gmail(), googlecalendar()]
});
```

Every user request scopes calls with:

```ts
corsair.withTenant(userId)
```

The Gmail and Calendar services call `tenant.gmail.*` and `tenant.googleCalendar.*` operations through Corsair. Direct Google API clients are not used anywhere in the codebase.

## Verification

```bash
npm run typecheck
npm run build
```

The build command runs `prisma generate` before `next build`.
