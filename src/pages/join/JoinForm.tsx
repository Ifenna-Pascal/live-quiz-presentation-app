import { type FormEvent, useState } from 'react'
import { ArrowRight, Users } from 'lucide-react'
import type { Player } from '../../api/types'
import { Avatar } from '../../components/ui/Avatar'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { pluralize } from '../../utils/format'

type Props = { title: string; questionCount: number; players: Player[]; onJoin: (name: string) => Promise<void> }

export function JoinForm({ title, questionCount, players, onJoin }: Props) {
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [joining, setJoining] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return setError('Pick a name so others know who you are.')
    setJoining(true)
    setError(null)
    try {
      await onJoin(trimmed)
    } catch (err) {
      setError((err as Error).message)
      setJoining(false)
    }
  }

  return (
    <>
      <p className="text-xs font-semibold tracking-wider text-brand-400 uppercase">You're invited</p>
      <h1 className="mt-1 font-display text-3xl font-bold tracking-tight">{title}</h1>
      <p className="mt-1 text-sm text-ink-300">{pluralize(questionCount, 'question')} waiting. Choose the name everyone will see.</p>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <Input
          label="Your name"
          name="player_name"
          autoFocus
          autoComplete="nickname"
          maxLength={30}
          placeholder="e.g. Ada"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            setError(null)
          }}
          error={error ?? undefined}
        />
        <Button type="submit" size="lg" loading={joining} className="w-full">
          Join now <ArrowRight className="size-4" />
        </Button>
      </form>
      <div className="mt-6 flex items-center gap-3 border-t border-white/5 pt-5">
        <div className="flex -space-x-2">
          {players.slice(-5).map((p) => (
            <Avatar key={p.player_id} name={p.player_name} size={28} className="animate-pop ring-2 ring-ink-850" />
          ))}
          {!players.length && (
            <span className="grid size-7 place-items-center rounded-full bg-ink-700">
              <Users className="size-3.5 text-ink-300" />
            </span>
          )}
        </div>
        <p className="text-sm text-ink-300">
          {players.length ? (
            <>
              <span className="font-semibold text-ink-100">{players.length}</span> already in the lobby
            </>
          ) : (
            'Be the first one in!'
          )}
        </p>
      </div>
    </>
  )
}
