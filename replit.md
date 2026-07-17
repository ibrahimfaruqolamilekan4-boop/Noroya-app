# Nooraya — Light of the Soul

An Islamic content and spiritual companion platform built with React + Vite + Express. Features include a Quran deep-search, AI counselor (Noor), video feed, daily wisdom, prayer tools, and more.

## Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Framer Motion
- **Backend**: Express + Vite dev-server middleware (single process in dev)
- **Auth/DB**: Firebase (Firestore + Auth)
- **Storage**: Supabase
- **AI**: Google Gemini API (via server-side proxy at `/api/ai/chat`)

## Running on Replit

```bash
npm run dev      # development (port 5000, Vite HMR)
npm run build    # production build
npm start        # production server (port 5000, serves dist/)
```

The workflow **Start application** runs `npm run dev` and opens on port 5000.

## Environment variables / secrets

| Key | Required | Purpose |
|-----|----------|---------|
| `GEMINI_API_KEY` | For live AI | Gemini API key — without it the app runs in Sandbox Mode with mock responses |
| `VITE_SUPABASE_URL` | For storage | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | For storage | Supabase anon key |
| `VITE_YOUTUBE_API_KEY` | For video feed | YouTube Data API v3 key |

The app degrades gracefully: if `GEMINI_API_KEY` is missing it uses built-in mock Quranic responses.

## Notes

- `package.json` has an `overrides` entry pinning `websocket-driver` to `0.7.5` to satisfy Replit's security policy (the Firebase dependency pulled in an older blocked version).
- `src/components/ErrorBoundary.tsx` was created during setup — it was imported by several components but missing from the repository.
