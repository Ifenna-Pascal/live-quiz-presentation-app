import { QRCodeSVG } from 'qrcode.react'
import { ExternalLink } from 'lucide-react'
import { cn } from '../../utils/cn'
import { joinUrl } from '../../utils/url'
import { CopyButton } from '../ui/CopyButton'

export function ShareCard({ presentationId, compact }: { presentationId: string; compact?: boolean }) {
  const url = joinUrl(presentationId)
  return (
    <div className={cn(compact ? 'space-y-5' : 'flex flex-col items-center gap-6 sm:flex-row')}>
      <div className="relative mx-auto shrink-0">
        <div className="absolute -inset-3 animate-glow rounded-3xl bg-brand-500/20 blur-xl" />
        <div className="relative rounded-2xl bg-white p-3">
          <QRCodeSVG value={url} size={compact ? 176 : 156} bgColor="#ffffff" fgColor="#09090b" level="M" />
        </div>
      </div>
      <div className="w-full min-w-0 flex-1">
        <p className="text-sm font-medium text-ink-200">Public join link</p>
        <p className="mt-1 text-xs text-ink-400">Players scan the code or open the link, then pick a name.</p>
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-ink-600 bg-ink-800 p-1.5 pl-3">
          <span className="min-w-0 flex-1 truncate font-mono text-sm text-brand-300">{url.replace(/^https?:\/\//, '')}</span>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="grid size-9 shrink-0 place-items-center rounded-lg text-ink-300 hover:bg-ink-700 hover:text-ink-100"
            aria-label="Open the join page in a new tab"
          >
            <ExternalLink className="size-4" />
          </a>
          <CopyButton text={url} />
        </div>
      </div>
    </div>
  )
}
