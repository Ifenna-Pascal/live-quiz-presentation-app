import { useCallback, useMemo, useState } from 'react'
import { Pencil, QrCode, X } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import type { Player } from '../../api/types'
import { useAuth } from '../../auth/context'
import { ChatPanel } from '../../components/chat/ChatPanel'
import { ConnectionBadge } from '../../components/feedback/ConnectionBadge'
import { PlaygroundShell } from '../../components/layout/PlaygroundShell'
import type { SideTab } from '../../components/layout/playgroundTabs'
import { RoomHeader } from '../../components/layout/RoomHeader'
import { RoomStatusBadge } from '../../components/layout/RoomStatusBadge'
import { LeaderboardPanel } from '../../components/leaderboard/LeaderboardPanel'
import { PlayersPanel } from '../../components/players/PlayersPanel'
import { WinnerCelebration } from '../../components/poll/WinnerCelebration'
import { ShareModal } from '../../components/share/ShareModal'
import { useToast } from '../../components/toast/toast'
import { Button } from '../../components/ui/Button'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { FullPageSpinner } from '../../components/ui/FullPageSpinner'
import { type ChatIdentity, useChat, useUnreadCount } from '../../hooks/chat'
import { useHostActions } from '../../hooks/host'
import { useLiveRoom, useNewArrivals, useRankChanges } from '../../hooks/room'
import { useDocumentTitle } from '../../hooks/ui'
import { isLeaderboardActive } from '../../utils/scoring'
import { presentationTitle } from '../../utils/format'
import { StatusScreen } from '../status/StatusScreen'
import { HostFinishedStage } from './HostFinishedStage'
import { HostLiveStage } from './HostLiveStage'
import { HostLobbyStage } from './HostLobbyStage'

export default function HostRoomPage() {
  const { id = '' } = useParams()
  const { user } = useAuth()
  const toast = useToast()
  const room = useLiveRoom(id, true)
  const actions = useHostActions(id, room.refetchAll)
  const moves = useRankChanges(room.leaderboard?.entries)
  const [visibleTab, setVisibleTab] = useState<SideTab | null>(null)
  const [shareOpen, setShareOpen] = useState(false)
  const [removing, setRemoving] = useState<Player | null>(null)

  useNewArrivals(room.players, (fresh) =>
    toast(fresh.length === 1 ? `${fresh[0].player_name} joined` : `${fresh.length} players joined`, 'join'),
  )

  const me = useMemo<ChatIdentity | null>(() => (user ? { role: 'host', id: user.id, name: user.name } : null), [user])
  const chat = useChat(id, me)
  const unread = useUnreadCount(chat.messages, chat.loaded, visibleTab === 'chat', user?.id)
  const onTab = useCallback((t: SideTab | null) => setVisibleTab(t), [])
  useDocumentTitle(room.presentation ? presentationTitle(room.presentation) : 'Host')

  if (room.loading) return <FullPageSpinner />
  if (room.deleted || !room.presentation) {
    return (
      <StatusScreen icon={<X className="size-6" />} title="Presentation not found" actionTo="/dashboard" actionLabel="Back to dashboard">
        {room.deleted ? 'This presentation was deleted.' : room.error?.message}
      </StatusScreen>
    )
  }
  const { presentation, poll, votes, leaderboard } = room
  const players = room.players ?? []
  if (!presentation.is_owner) {
    return (
      <StatusScreen icon={<X className="size-6" />} title="This isn't your presentation" actionTo={`/join/${id}`} actionLabel="Join as a player">
        Only the host can open this screen.
      </StatusScreen>
    )
  }

  const stage = !presentation.has_started ? (
    <HostLobbyStage
      presentationId={id}
      players={players}
      totalPolls={presentation.polls.length}
      prize={presentation.prize}
      starting={actions.busy === 'start'}
      onStart={() => {
        if (!players.length && !window.confirm('Nobody has joined yet. Start anyway? No one can join after you start.')) return
        void actions.start()
      }}
    />
  ) : presentation.has_finished ? (
    <HostFinishedStage leaderboard={leaderboard} playerCount={players.length} totalPolls={presentation.polls.length} />
  ) : poll ? (
    <HostLiveStage
      presentation={presentation}
      poll={poll}
      votes={votes}
      players={players}
      leaderboard={leaderboard}
      moves={moves}
      busy={actions.busy}
      onPrevious={actions.previous}
      onReveal={actions.reveal}
      onNext={actions.next}
      onFinish={actions.finish}
    />
  ) : (
    <FullPageSpinner />
  )

  return (
    <>
      <PlaygroundShell
        header={
          <RoomHeader
            backTo="/dashboard"
            title={presentationTitle(presentation)}
            status={
              <>
                <RoomStatusBadge presentation={presentation} />
                <ConnectionBadge status={room.status} />
              </>
            }
            actions={
              !presentation.has_started && (
                <>
                  <Link to={`/presentations/${id}/edit`} className="hidden sm:block">
                    <Button variant="ghost" size="sm">
                      <Pencil className="size-4" /> Edit
                    </Button>
                  </Link>
                  <Button variant="secondary" size="sm" onClick={() => setShareOpen(true)}>
                    <QrCode className="size-4" /> <span className="hidden sm:inline">Share</span>
                  </Button>
                </>
              )
            }
          />
        }
        stage={stage}
        panels={{
          players: (
            <PlayersPanel
              players={players}
              votedIds={poll && !presentation.has_finished ? new Set(votes.map((v) => v.player_id)) : undefined}
              onRemove={presentation.has_finished ? undefined : setRemoving}
            />
          ),
          chat: <ChatPanel messages={chat.messages} meId={user?.id ?? ''} onSend={chat.send} />,
          leaderboard: <LeaderboardPanel leaderboard={leaderboard} moves={moves} />,
        }}
        playerCount={players.length}
        unreadChat={unread}
        leaderboardActive={isLeaderboardActive(leaderboard)}
        onVisibleTabChange={onTab}
      />
      {room.celebration && poll && room.celebration.poll_id === poll.id && (
        <WinnerCelebration win={room.celebration} options={poll.options} onDone={room.dismissCelebration} />
      )}
      <ShareModal presentationId={id} open={shareOpen} onClose={() => setShareOpen(false)} />
      <ConfirmDialog
        open={!!removing}
        onClose={() => setRemoving(null)}
        title={`Remove ${removing?.player_name}?`}
        message="Their votes and chat messages will be deleted too. They won't be able to rejoin once the presentation has started."
        confirmLabel="Remove player"
        danger
        onConfirm={() => (removing ? actions.removePlayer(removing.player_id, removing.player_name) : undefined)}
      />
    </>
  )
}

