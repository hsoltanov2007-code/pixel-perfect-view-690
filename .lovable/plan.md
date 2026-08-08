# Plan: Separate Contact page + AI live chat

## What we’re building

1. A dedicated `/contact` page that keeps the existing contact form and adds a **Live chat** button.
2. An **AI assistant chat** on `/contact` with threaded conversations persisted in the database.
3. An **Escalate to operator** flow: the user can request a human; if no operator is online, the chat collects their message/contact info for later reply.

## Technical approach

### Backend

- Enable Lovable Cloud to get Supabase database + auth infrastructure.
- Install AI SDK packages: `ai`, `@ai-sdk/react`, `@ai-sdk/openai-compatible`.
- Add Supabase tables:
  - `chat_threads` (id, session_id, title, status, created_at, updated_at)
  - `chat_messages` (id, thread_id, role, content, created_at)
- Use an **anonymous session cookie** for thread ownership so visitors don’t have to sign in to chat. RLS policies will scope reads/writes to the session id stored in the cookie.
- Create a streaming server route `/api/chat` that calls Lovable AI Gateway using `google/gemini-3.6-flash`.

### Frontend

- Create route `src/routes/contact.tsx` as the contact page layout.
- Add `src/routes/contact.index.tsx` for the default contact view (form + chat CTA).
- Add `src/routes/contact.$threadId.tsx` for an active chat thread (required for threaded conversations).
- Build the chat UI with AI Elements components (`conversation`, `message`, `prompt-input`).
- Render assistant messages with markdown support.
- Add a floating or inline **Live chat** button on `/contact` that creates a new thread and navigates to `/contact/<threadId>`.
- Add an **Escalate to operator** button inside the chat that:
  - Sets the thread status to `needs_operator`.
  - Shows a short form for email/phone if no operator is available.
  - Saves the escalation request as a system message in the thread.

### Navigation updates

- Update `Navbar` and `Footer` links to use TanStack `Link` with route paths instead of hash anchors, so `Contact` points to `/contact` and other links still scroll to the correct sections on the home page.

## Out of scope for this turn

- A real-time operator dashboard or live operator presence detection. The escalation path will flag the thread and collect contact details so a human can reply later.
- Requiring users to sign in before chatting; threads will be owned by an anonymous session cookie.

## Verification

- Type-check and build the project.
- Open `/contact`, start a thread, send a message, and confirm the AI replies.
- Reload the thread URL and confirm messages restore.
- Test the escalation button and verify the thread status updates.
