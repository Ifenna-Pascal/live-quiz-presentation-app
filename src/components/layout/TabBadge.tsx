import type { SideTab } from './playgroundTabs'

type Props = { tab: SideTab; unreadChat: number; playerCount: number; leaderboardActive: boolean }

/** The little counter or dot next to a tab label. */
export function TabBadge({ tab, unreadChat, playerCount, leaderboardActive }: Props) {
  if (tab === 'chat' && unreadChat > 0) {
    return (
      <span className="grid h-4.5 min-w-4.5 animate-pop place-items-center rounded-full bg-brand-500 px-1 text-[10px] font-bold text-ink-950">
        {unreadChat > 9 ? '9+' : unreadChat}
      </span>
    )
  }
  if (tab === 'players') return <span className="text-xs text-ink-400 tabular-nums">{playerCount}</span>
  if (tab === 'leaderboard' && leaderboardActive) {
    return <span className="size-2 animate-glow rounded-full bg-brand-400 shadow-[0_0_10px_#ff7a1a]" aria-label="Scores are in" />
  }
  return null
}
