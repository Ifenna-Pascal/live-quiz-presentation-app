# Trivia — frontend

The web app for a live trivia game. A host builds a set of timed questions, shares a link, and runs
the game on a big screen. Players join from their phones, race to tap the right answer, chat, and
climb a live leaderboard. A presentation can carry optional prize money that the top 3 share.

Built with React 19, TypeScript, Vite 6, Tailwind CSS v4 and React Router 7. It talks to the Go API
in `../interactive-presentation`; the frontend holds no game logic of its own beyond display.

## Run it

```bash
npm install
npm run dev            # http://localhost:5173 (needs the API on :8081)
```

In development Vite forwards `/api/*` to `http://localhost:8081` and strips the `/api` prefix, so the
browser never makes a cross-origin request. Point it at another API with
`API_PROXY_TARGET=http://host:port npm run dev`.

### Configuration

| Variable | When | What it does |
| --- | --- | --- |
| `API_PROXY_TARGET` | `npm run dev` | Where Vite forwards `/api` (default `http://localhost:8081`) |
| `VITE_API_URL` | build time | Full API URL to call directly instead of `/api` (see `.env.example`). Leave unset to use `/api` |
| `SCREENSHOTS_DIR` | `npm run test:e2e` | Saves a screenshot of every step of the e2e game |

### Docker

`docker compose up --build` in the backend folder builds this app and serves it on
**http://localhost:3000**. The [Dockerfile](Dockerfile) builds the static site with Node 20, then
serves it with nginx. [nginx.conf](nginx.conf):

- forwards `/api/` to the `api` service on port 8081, with buffering off and a 1-hour read timeout
  so the live event stream stays open;
- caches hashed files in `/assets/` for a year;
- serves `index.html` for every other path (single-page app routing).

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server on :5173 |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Serve the built `dist/` |
| `npm run typecheck` | Type-check only |
| `npm test` / `npm run test:watch` | Unit tests (Vitest + Testing Library, jsdom) |
| `npm run test:e2e` | One full game with a host and a player in two browsers (Playwright). Needs the API running; starts Vite if it isn't already |
| `npm run lint` | ESLint |

## Screens

| Route | Who | What |
| --- | --- | --- |
| `/` | anyone | Landing page; paste a join link (or a bare presentation id) to jump in |
| `/signup`, `/login` | host | Create an account / log in |
| `/dashboard` | host | Your presentations with stats: open, edit (before start), copy link, delete |
| `/presentations/new`, `/presentations/:id/edit` | host | Editor: questions, answers, correct answers, time limits, prize money |
| `/host/:id` | host | Lobby (link + QR code, start), then the live game, then final results |
| `/join/:id` | player | Public link: pick a name (or "Welcome back" if this browser already joined) |
| `/play/:id` | player | Lobby, answering, results after each question, final standings |
| `*` | anyone | Not found |

Host routes are wrapped in `ProtectedRoute` and send you to `/login` when there is no session.
Every page except the landing page is lazy-loaded.

Both rooms (`/host/:id` and `/play/:id`) share one layout (`PlaygroundShell`): the question on the
left, and **Players / Chat / Leaderboard** tabs on the right. On phones the tabs move to a bottom tab
bar. Tabs show badges for unread chat messages.

## How a game runs

1. **Build.** In the editor the host adds questions (or loads a sample quiz), 2+ answers each, and a
   time limit of 5–600 seconds (presets 10/20/30/60, default 20). Answers get keys A, B, C… on save.
   - A question with an answer marked correct is a **quiz question** (scored).
   - A question with no correct answer is an **opinion poll**: each player picks once and sees how
     the room voted. Nobody scores.
   - Prize money is optional (currency NGN for now). The editor previews how it would be split.
   - A presentation can only be edited before it starts.
2. **Lobby.** The host shares the join link or QR code. Players pick a name; the host sees them
   arrive live and can remove anyone.
3. **Play.** The host starts the game. Each question opens with a countdown.
   - Players tap to answer. A wrong pick is crossed out and they can try another option until time
     runs out.
   - The **first correct answer wins** the question's point and closes it. The host's screen shows a
     "Hooray!" pop-up (`WinnerCelebration`) and the winner gets confetti.
   - While the clock runs, the host's screen shows only the answers — no counts and no correct
     answer — because the whole room can see it.
   - A question also closes when time runs out or the host presses **End & reveal**.
4. **Reveal.** Once closed, everyone sees the correct answer, the vote bars, who won, and their own
   rank. The host moves with **Previous** / **Next**, and **Finish** on the last question.
5. **Finish.** Final standings with the podium, and payouts if there is a prize.

### Leaderboard and prize

- One point per question won. The leaderboard stays dark ("The race hasn't started") until someone
  scores, then shows the podium, rank movements (up/down arrows) and your own position.
- With a prize, the top 3 ranks share the pool in proportion to their score. Ties share a rank.
  Payouts come from the API on each leaderboard entry and update live; `splitPrize`
  in `src/utils/scoring.ts` mirrors the API's rule only for the editor preview.

## How it works

### Talking to the API

All calls go through `src/api/client.ts`:

- `request()` — plain `fetch` to `API_BASE_URL` (`VITE_API_URL` or `/api`). Errors become an
  `ApiError` with the HTTP status (0 for network failures) and the API's `error` message.
- `authorizedRequest()` — the same, with the host's access token. Refreshes the token first if it is
  about to expire, and retries once after a 401.

Each domain has its own file in `src/api/` (auth, presentations, polls, players, chat, leaderboard),
and all response shapes are in `src/api/types.ts`.

### Live updates

One Server-Sent Events stream per presentation (`GET /presentations/:id/events`), managed by
`PresentationStream` in `src/realtime/stream.ts`. It is shared by every hook on the page and closes
when the last one unmounts.

| Event | Screen refetches |
| --- | --- |
| `presentation` | presentation, current question, leaderboard |
| `players` | players, leaderboard |
| `vote` | votes for the current question, leaderboard |
| `winner` | current question, votes, leaderboard; shows the celebration |
| `chat` | appends the message (no refetch) |
| `deleted` | replaces the room with a "presentation was deleted" screen |
| `resync` | everything (sent by the client after each (re)connect) |

`useLiveRoom` in `src/hooks/room.ts` wires this together for both rooms. Events only say *what*
changed, and the screen refetches just that. If the stream drops, the room polls every 5 s until it
is live again. The connection state shows as a badge (`ConnectionBadge`).

### Countdown

The API sends `closes_at` and its own `server_time`. `useCountdown` measures time left against the
server's clock, so a phone with a wrong clock still shows the right time. When the countdown ends,
`usePollExpiry` refetches the question so "time's up" appears without waiting for an event.

### Host sessions

`SessionManager` (`src/auth/session.ts`) owns the host's tokens, stored in localStorage:

- refreshes the 15-minute access token silently a minute before it expires;
- refresh tokens are single use, so concurrent refreshes are merged into one, and a Web Lock plus the
  `storage` event keep every open tab on the same session (a reused token counts as theft on the API);
- `SessionExpiryBanner` warns when the whole session is less than a day from ending.

`AuthProvider` / `useAuth` expose the session to React.

### Players

Joining returns a secret `player_token`. It is saved per presentation in localStorage
(`pollroom:player:<id>`, see `src/storage/player.ts`) and sent with every answer and chat message.
Coming back to the join link with a saved identity shows "Welcome back" instead of the name form.

### Chat

`useChat` (`src/hooks/chat.ts`) loads the last 200 messages, then appends new ones from the stream
(keeping at most 300). The host posts with the access token, players with their id + token. There are
quick emoji reactions above the composer.

## Code layout

- `.tsx` files: one component per file.
- `.ts` files: one file per domain, holding all its related functions (for example, every
  player API call is in `src/api/players.ts`).

```
src/
  main.tsx, app/   entry point, App (providers), AppRoutes
  api/             client (request helpers), auth, chat, players, polls, presentations, leaderboard, types
  auth/            session (SessionManager), context (useAuth), AuthProvider, ProtectedRoute
  realtime/        stream.ts: PresentationStream (EventSource), useStreamEvent, useStreamStatus
  hooks/           room (live room, countdown, rank changes), chat, host (host actions), ui, useResource
  storage/         localStorage helpers and the saved player identity (player.ts)
  components/      ui/, layout/, toast/, feedback/, players/, chat/, leaderboard/, poll/, prize/, share/
  pages/           landing/, auth/, dashboard/, editor/ (draft.ts), host/, join/, play/, status/
  utils/           format (money, names), time, url, scoring (prize split), cn, optionKeys
  test/            Vitest setup
e2e/               Playwright full-game test
```

Tests sit next to the code they cover (`*.test.ts(x)`): session refresh, room hooks, chat, the
editor draft, prize split and formatting, timing, and the podium.
