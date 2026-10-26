import type { Presentation, PresentationInput, Prize } from '../../api/types'
import { OPTION_KEYS } from '../../utils/optionKeys'

export type DraftOption = { id: string; value: string; correct: boolean }
export type DraftPoll = { id: string; question: string; timeLimit: number; options: DraftOption[] }
export type DraftProblem = { question: boolean; options: boolean; time: boolean }

export function uid() {
  return crypto.randomUUID()
}

/** Seconds a player has to answer. The API accepts 5–600. */
export const DEFAULT_TIME_LIMIT = 20
export const MIN_TIME_LIMIT = 5
export const MAX_TIME_LIMIT = 600
export const TIME_PRESETS = [10, 20, 30, 60]

export const MAX_PRIZE = 1_000_000_000_000

/** The editor's prize state. amount is digits only ('' when empty). */
export type DraftPrize = { enabled: boolean; amount: string; currency: string }

export const NO_PRIZE: DraftPrize = { enabled: false, amount: '', currency: 'NGN' }

export function prizeToDraft(prize: Prize | null): DraftPrize {
  return prize ? { enabled: true, amount: String(prize.pool), currency: prize.currency } : NO_PRIZE
}

/** True when prize money is switched on but the amount is not usable. */
export function isPrizeInvalid(prize: DraftPrize) {
  const amount = Number(prize.amount)
  return prize.enabled && !(Number.isInteger(amount) && amount >= 1 && amount <= MAX_PRIZE)
}

export function blankOption(): DraftOption {
  return { id: uid(), value: '', correct: false }
}

export function blankPoll(): DraftPoll {
  return { id: uid(), question: '', timeLimit: DEFAULT_TIME_LIMIT, options: [blankOption(), blankOption()] }
}

const SAMPLE = [
  { q: 'Which planet is known as the Red Planet?', o: ['Venus', 'Mars', 'Jupiter', 'Mercury'], c: 1, t: 15 },
  { q: 'What does HTML stand for?', o: ['HyperText Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language'], c: 0, t: 20 },
  { q: 'How many bits are in a byte?', o: ['4', '8', '16', '32'], c: 1, t: 10 },
  { q: 'Which language do you enjoy most?', o: ['Go', 'TypeScript', 'Rust', 'Python'], c: -1, t: 20 },
]

/** A ready-made quiz to try the app quickly. */
export function samplePolls(): DraftPoll[] {
  return SAMPLE.map(({ q, o, c, t }) => ({
    id: uid(),
    question: q,
    timeLimit: t,
    options: o.map((value, i) => ({ id: uid(), value, correct: i === c })),
  }))
}

/** A copy of list with the item at `from` moved by `by` places. */
export function moveItem<T>(list: T[], from: number, by: number): T[] {
  const to = from + by
  if (to < 0 || to >= list.length) return list
  const next = [...list]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

/** What is missing in each poll before it can be saved. */
export function findDraftProblems(polls: DraftPoll[]): DraftProblem[] {
  return polls.map((p) => ({
    question: !p.question.trim(),
    options: p.options.filter((o) => o.value.trim()).length < 2,
    time: !(p.timeLimit >= MIN_TIME_LIMIT && p.timeLimit <= MAX_TIME_LIMIT),
  }))
}

/** Drops empty answers and gives the rest keys A, B, C… A prize that is switched off is left out. */
export function draftToInput(title: string, polls: DraftPoll[], prize: DraftPrize = NO_PRIZE): PresentationInput {
  return {
    title: title.trim(),
    ...(prize.enabled && Number(prize.amount) > 0 ? { prize_pool: Number(prize.amount), prize_currency: prize.currency } : {}),
    polls: polls.map((p) => ({
      question: p.question.trim(),
      time_limit_seconds: p.timeLimit,
      options: p.options
        .filter((o) => o.value.trim())
        .map((o, i) => ({ key: OPTION_KEYS[i], value: o.value.trim(), ...(o.correct ? { correct: true } : {}) })),
    })),
  }
}

export function presentationToDraft(p: Presentation): DraftPoll[] {
  return p.polls.map((poll) => ({
    id: uid(),
    question: poll.question,
    timeLimit: poll.time_limit_seconds || 20,
    options: poll.options.map((o) => ({ id: uid(), value: o.value, correct: !!o.correct })),
  }))
}
