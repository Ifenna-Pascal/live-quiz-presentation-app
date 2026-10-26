# Trivia — frontend

React 19 + TypeScript + Vite + Tailwind CSS v4 frontend for the Go API in `../interactive-presentation`.

## Run

```bash
npm install
npm run dev            # http://localhost:5173 (needs the API on :8081)
```

Vite forwards `/api/*` to `http://localhost:8081`. Point it elsewhere with
`API_PROXY_TARGET=http://host:port npm run dev`.

With Docker, `docker compose up --build` in the backend folder serves this app on
**http://localhost:3000** (nginx forwards `/api` to the API, including the live stream).

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Type-check and build to `dist/` |
| `npm test` | Unit tests (Vitest) |
| `npm run test:e2e` | Full game in two browsers (Playwright; needs the API running) |
| `npm run lint` | ESLint |

Set `SCREENSHOTS_DIR=/some/folder` when running the e2e test to save a screenshot of every step.

## Flow

| Route | Who | What |
| --- | --- | --- |
| `/` | anyone | Landing page; paste a join link |
| `/signup`, `/login` | host | Account |
| `/dashboard` | host | Presentations: open, edit (before start), copy link, delete |
| `/presentations/new`, `/presentations/:id/edit` | host | Build questions, mark correct answers |
| `/host/:id` | host | Lobby (link + QR, start), then live results, reveal, previous/next, finish |
| `/join/:id` | player | Public link: pick a name |
| `/play/:id` | player | Lobby, voting, answer feedback, final standings |

Both rooms share one layout: the poll on the left, **Players / Chat / Leaderboard** on the right
(bottom tab bar on phones).

## How it works

- **Live updates**: one Server-Sent Events stream per presentation (`src/realtime`). Events say what
  changed and the screen refetches just that. If the stream drops, the room polls every 5 s until it
  reconnects, and refetches everything on reconnect.
- **Sessions**: `SessionManager` (`src/auth/session.ts`) refreshes the 15-minute access token silently before it
  expires and retries once on a 401. Refresh tokens are single use; tabs share one session through
  localStorage and a Web Lock so they never reuse a rotated token.
- **Players**: registration returns a secret `player_token`, saved in the browser and sent with every
  vote and chat message.
- **Timed questions, fastest wins**: the host sets seconds per question in the editor. The countdown
  (`useCountdown` in `src/hooks/room.ts`) follows the server's clock, so a phone with a wrong clock still shows the right time.
  Players tap to answer; a wrong pick is crossed out and they can try another option until time runs out.
  The first correct answer wins the point and closes the question; the host's screen shows a "Hooray!"
  pop-up (`WinnerCelebration`) from the `winner` stream event. While the clock runs, the host's screen
  shows only the answers (no counts, no correct answer), because the whole room sees it.
- **Leaderboard**: one point per question won. It stays dark ("The race hasn't started") until the first
  win, then shows the podium, rank movements and your position.

## Code layout

- `.tsx` files: one component per file.
- `.ts` files: one file per domain, holding all its related functions (for example, every
  player API call is in `src/api/players.ts`).

```
src/
  api/          client (request helpers), auth, chat, players, polls, presentations, leaderboard, types
  auth/         session (SessionManager), context (AuthContext, useAuth), AuthProvider, ProtectedRoute
  realtime/     stream.ts: PresentationStream (EventSource), useStreamEvent, useStreamStatus
  hooks/        room, chat, host, ui, useResource
  storage/      localStorage helpers and the saved player identity (player.ts)
  components/   ui/, layout/, toast/, feedback/, players/, chat/, leaderboard/, poll/, share/
  pages/        landing/, auth/, dashboard/, editor/ (draft.ts), host/, join/, play/, status/
  utils/        format, time, url, scoring, cn, optionKeys
```
