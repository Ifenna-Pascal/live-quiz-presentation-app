import { Link2, MessageCircle, Trophy, Zap, type LucideIcon } from 'lucide-react'

export const FEATURES: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Link2, title: 'One public link', text: 'Every presentation gets a join link and QR code. Players sign up with just a name.' },
  { icon: Zap, title: 'Instant voting', text: 'Votes, joins and question changes stream to every screen the moment they happen.' },
  { icon: MessageCircle, title: 'Room chat', text: 'Players and the host talk in one shared chat while the game runs.' },
  { icon: Trophy, title: 'Live leaderboard', text: 'Reveal the answer and watch players climb the podium in real time.' },
]
