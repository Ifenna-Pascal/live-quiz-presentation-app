// Shapes returned by the Go API (see internal/constant/model).

export type User = { id: string; name: string; email: string }

export type Session = User & {
  access_token: string
  access_token_expires_at: string
  refresh_token: string
  refresh_token_expires_at: string
}

export type Option = { key: string; value: string; correct?: boolean }
export type PollInput = { question: string; time_limit_seconds: number; options: Option[] }
export type PresentationInput = {
  title: string
  /** Optional prize money in whole units of prize_currency. Omit for no prize. */
  prize_pool?: number
  prize_currency?: string
  polls: PollInput[]
}

/** Money the top 3 ranks share. Null on presentations without a prize. */
export type Prize = { pool: number; currency: string }

export type PresentationPoll = {
  id: string
  question: string
  time_limit_seconds: number
  revealed: boolean
  options: Option[]
}

export type Presentation = {
  id: string
  title: string
  current_poll_index: number
  has_started: boolean
  has_finished: boolean
  is_owner: boolean
  prize: Prize | null
  polls: PresentationPoll[]
}

export type MyPresentation = {
  id: string
  title: string
  current_poll_index: number
  has_started: boolean
  has_finished: boolean
  poll_count: number
  player_count: number
  prize: Prize | null
  created_at: string
}

/** Why a poll stopped taking answers. */
export type ClosedReason = 'won' | 'time_up' | 'revealed' | 'finished'

export type PollWinner = {
  player_id: string
  player_name: string
  key: string
  elapsed_ms: number
  won_at: string
}

export type CurrentPoll = {
  id: string
  index: number
  question: string
  options: Option[]
  time_limit_seconds: number
  /** Has a right answer (quiz question). Opinion polls take one answer each. */
  scored: boolean
  /** True once the poll is closed; options then carry `correct`. */
  revealed: boolean
  closed_reason?: ClosedReason
  opened_at: string | null
  closes_at: string | null
  server_time: string
  winner: PollWinner | null
  /** Added by the client: Date.now() when the response arrived (for the countdown). */
  received_at: number
}

export type VoteResult = { correct: boolean; won: boolean; scored: boolean; elapsed_ms?: number }

/** The `winner` stream event. */
export type WinnerEvent = PollWinner & { poll_id: string }

export type Player = { player_id: string; player_name: string }
export type RegisteredPlayer = Player & { player_token: string }

export type Vote = { key: string; player_id: string; player_name: string }

export type LeaderboardEntry = {
  rank: number
  player_id: string
  player_name: string
  score: number
  answered: number
  /** Current share of the prize; 0 without a prize or outside the top 3 ranks. */
  payout: number
}
export type Leaderboard = { scored_polls: number; prize: Prize | null; entries: LeaderboardEntry[] }

export type ChatMessage = {
  id: string
  author_id: string
  author_name: string
  author_role: 'host' | 'player'
  body: string
  created_at: string
}
