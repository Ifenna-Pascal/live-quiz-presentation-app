import { Check, Copy } from 'lucide-react'
import { useCopyToClipboard } from '../../hooks/ui'
import { Button } from './Button'

export function CopyButton({ text, label = 'Copy', className }: { text: string; label?: string; className?: string }) {
  const { copied, copy } = useCopyToClipboard()
  return (
    <Button type="button" variant="secondary" size="sm" className={className} onClick={() => copy(text)}>
      {copied ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
      {copied ? 'Copied' : label}
    </Button>
  )
}
