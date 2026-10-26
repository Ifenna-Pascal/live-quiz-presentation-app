import type { MyPresentation } from '../../api/types'
import { Badge } from '../../components/ui/Badge'

export function PresentationStatusBadge({ p }: { p: Pick<MyPresentation, 'has_started' | 'has_finished'> }) {
  if (p.has_finished) return <Badge tone="green">Finished</Badge>
  if (p.has_started)
    return (
      <Badge tone="brand" dot>
        Live
      </Badge>
    )
  return <Badge>Lobby open</Badge>
}
