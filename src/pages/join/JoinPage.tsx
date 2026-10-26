import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Lock, X } from 'lucide-react'
import { ApiError } from '../../api/client'
import { registerPlayer } from '../../api/players'
import { CenteredShell } from '../../components/layout/CenteredShell'
import { EmptyState } from '../../components/ui/EmptyState'
import { FullPageSpinner } from '../../components/ui/FullPageSpinner'
import { useLiveRoom } from '../../hooks/room'
import { useDocumentTitle } from '../../hooks/ui'
import { forgetPlayer, getPlayer, savePlayer } from '../../storage/player'
import { presentationTitle } from '../../utils/format'
import { JoinForm } from './JoinForm'
import { WelcomeBack } from './WelcomeBack'

/** The public link: players pick a name and register. */
export default function JoinPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const room = useLiveRoom(id, false)
  const [existing, setExisting] = useState(() => getPlayer(id))
  useDocumentTitle(room.presentation ? `Join ${presentationTitle(room.presentation)}` : 'Join')

  if (room.loading) return <FullPageSpinner />
  if (!room.presentation || room.deleted) {
    const notFound = room.deleted || (room.error instanceof ApiError && [400, 404].includes(room.error.status))
    return (
      <CenteredShell>
        <EmptyState icon={<X className="size-6" />} title="This link doesn't work">
          {notFound ? 'The presentation was not found. Check the link with your host.' : room.error?.message}
        </EmptyState>
      </CenteredShell>
    )
  }

  const { presentation } = room
  const players = room.players ?? []
  const stillRegistered = !!existing && players.some((p) => p.player_id === existing.player_id)

  return (
    <CenteredShell>
      {stillRegistered ? (
        <WelcomeBack
          presentationId={id}
          name={existing!.player_name}
          canSwitch={!presentation.has_started}
          onSwitch={() => {
            forgetPlayer(id)
            setExisting(null)
          }}
        />
      ) : presentation.has_started ? (
        <EmptyState icon={<Lock className="size-6" />} title="Registration is closed">
          This presentation has already started, so new players can't join.
        </EmptyState>
      ) : (
        <JoinForm
          title={presentationTitle(presentation)}
          questionCount={presentation.polls.length}
          players={players}
          onJoin={async (name) => {
            const player = await registerPlayer(id, name)
            savePlayer(id, player)
            navigate(`/play/${id}`)
          }}
        />
      )}
    </CenteredShell>
  )
}
