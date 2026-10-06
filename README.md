# My Turn Pilot

A mobile-first Next.js + Tailwind landing page / proof-of-concept for **My Turn by Never Too Old to Play**.

## What is included

- Soft blue, calm, connected visual direction
- Story-led scrolling journey rather than a standard sales page
- Real handwritten play notes section
- Interactive self-reflection question with personalised response
- Founding pilot event section
- Pilot registration form UI with success state
- Responsive mobile / tablet / desktop layout
- Australian English copy
- No paid UI libraries or external design packages

## Run locally in VS Code

1. Unzip the folder.
2. Open the folder in VS Code.
3. Open Terminal > New Terminal.
4. Run:

```bash
npm install
npm run dev
```

5. Visit `http://localhost:3000`.

## Before publishing

### 1. Replace the note images with the final edited files

The two newly uploaded `.jpf` images use a JPEG-2000 variant that could not be reliably decoded in this build environment. I used the earlier PNG versions for `note-1.png` and `note-2.png`, and converted the third edited note successfully.

To use all three final edited versions, export each image on your computer as ordinary JPG or PNG and replace:

- `public/notes/note-1.png`
- `public/notes/note-2.png`
- `public/notes/note-3.jpg`

Keep the same file names and the page will update automatically.

### 2. Connect the registration form

At the moment the form is deliberately front-end only so the project runs with no accounts or API keys. When you decide where registrations should go, connect `handleSubmit()` in:

`components/MyTurnJourney.tsx`

Good options include your existing Supabase project, Resend + database, or a simple form provider for the earliest pilot.

### 3. Add the date and capacity when confirmed

Search for `The founding pilot` in `components/MyTurnJourney.tsx` and add the exact date/time/capacity when you have chosen them.

## Integrating into an existing Next.js / Tailwind site

If your Never Too Old to Play website already uses Next.js App Router and Tailwind, you do not need to replace the whole website.

Recommended integration:

1. Create `app/my-turn/page.tsx` and copy the contents of this project's `app/page.tsx`.
2. Copy `components/MyTurnJourney.tsx` into your existing `components` folder.
3. Copy `public/notes` into your existing `public` folder.
4. Add the custom colours/shadows from `tailwind.config.ts` to your existing Tailwind config.
5. Add the small custom CSS helpers from `app/globals.css` to your existing stylesheet.

## Brand structure used in the copy

**MY TURN** is treated as the wider concept. The page positions the first Chirnside Park gathering as a founding pilot, leaving room later for My Turn Club, My Turn Podcast, My Turn Today, mentoring, events and merchandise.
