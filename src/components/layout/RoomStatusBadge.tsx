import type { Presentation } from '../../api/types'
import { Badge } from '../ui/Badge'

export function RoomStatusBadge({ presentation }: { presentation: Presentation }) {
  if (presentation.has_finished) return <Badge tone="green">Finished</Badge>
  if (presentation.has_started)
    return (
      <Badge tone="brand" dot>
        Live
      </Badge>
    )
  return <Badge>Lobby</Badge>
}
