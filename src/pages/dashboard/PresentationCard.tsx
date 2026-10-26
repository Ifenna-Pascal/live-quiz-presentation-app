import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Pencil, Radio, Trash2, Trophy, Users } from 'lucide-react'
import type { MyPresentation } from '../../api/types'
import { PrizeBadge } from '../../components/prize/PrizeBadge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { CopyButton } from '../../components/ui/CopyButton'
import { IconButton } from '../../components/ui/IconButton'
import { ProgressBar } from '../../components/ui/ProgressBar'
import { joinUrl } from '../../utils/url'
import { pluralize, presentationTitle } from '../../utils/format'
import { timeAgo } from '../../utils/time'
import { PresentationStatusBadge } from './PresentationStatusBadge'

type Props = { p: MyPresentation; index: number; onDelete: (id: string) => Promise<void> }

export function PresentationCard({ p, index, onDelete }: Props) {
  const [confirming, setConfirming] = useState(false)
  const progress = p.has_finished ? 1 : p.poll_count ? Math.max(0, p.current_poll_index) / p.poll_count : 0
  const openLabel = p.has_finished ? 'See results' : p.has_started ? 'Open live room' : 'Open lobby'
  const OpenIcon = p.has_finished ? Trophy : p.has_started ? Radio : ArrowUpRight

  return (
    <div className="animate-fade-up" style={{ animationDelay: `${index * 45}ms` }}>
      <Card className="group flex h-full flex-col p-5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-ink-800/70">
        <div className="flex items-start justify-between gap-3">
          <PresentationStatusBadge p={p} />
          <div className="-mt-1 -mr-1 flex items-center">
            {!p.has_started && (
              <Link
                to={`/presentations/${p.id}/edit`}
                aria-label="Edit"
                title="Edit"
                className="grid size-9 place-items-center rounded-lg text-ink-300 transition-colors hover:bg-ink-700 hover:text-ink-100"
              >
                <Pencil className="size-4" />
              </Link>
            )}
            <IconButton label="Delete" onClick={() => setConfirming(true)} className="hover:text-red-300">
              <Trash2 className="size-4" />
            </IconButton>
          </div>
        </div>
        {p.prize && <PrizeBadge prize={p.prize} className="mt-3 self-start" />}
        <h3 className="mt-4 line-clamp-2 font-display text-lg font-semibold">{presentationTitle(p)}</h3>
        <p className="mt-1 flex items-center gap-3 text-sm text-ink-300">
          <span>{pluralize(p.poll_count, 'question')}</span>
          <span className="flex items-center gap-1">
            <Users className="size-3.5" /> {p.player_count}
          </span>
          <span className="text-ink-400">{timeAgo(p.created_at)}</span>
        </p>
        <ProgressBar value={progress} className="mt-4 h-1.5" />
        <div className="mt-5 flex gap-2">
          <Link to={`/host/${p.id}`} className="flex-1">
            <Button size="sm" className="w-full">
              <OpenIcon className="size-4" /> {openLabel}
            </Button>
          </Link>
          {!p.has_started && <CopyButton text={joinUrl(p.id)} label="Link" />}
        </div>
      </Card>
      <ConfirmDialog
        open={confirming}
        onClose={() => setConfirming(false)}
        title="Delete this presentation?"
        message={`"${presentationTitle(p)}" and all its players, votes and chat will be gone for good.`}
        confirmLabel="Delete"
        danger
        onConfirm={() => onDelete(p.id)}
      />
    </div>
  )
}
