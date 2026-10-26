import { MessageCircle, Presentation, Trophy, Users, type LucideIcon } from 'lucide-react'

export type SideTab = 'players' | 'chat' | 'leaderboard'
export type PlaygroundTab = 'stage' | SideTab

export const SIDE_TABS: { id: SideTab; label: string; icon: LucideIcon }[] = [
  { id: 'players', label: 'Players', icon: Users },
  { id: 'chat', label: 'Chat', icon: MessageCircle },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
]

export const STAGE_TAB = { id: 'stage' as const, label: 'Poll', icon: Presentation }
