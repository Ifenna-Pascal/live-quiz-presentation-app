import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { UserX, X } from 'lucide-react'
import { ChatPanel } from '../../components/chat/ChatPanel'
import { ConnectionBadge } from '../../components/feedback/ConnectionBadge'
import { PlaygroundShell } from '../../components/layout/PlaygroundShell'
import type { SideTab } from '../../components/layout/playgroundTabs'
import { RoomHeader } from '../../components/layout/RoomHeader'
import { RoomStatusBadge } from '../../components/layout/RoomStatusBadge'
import { LeaderboardPanel } from '../../components/leaderboard/LeaderboardPanel'
import { PlayersPanel } from '../../components/players/PlayersPanel'
import { useToast } from '../../components/toast/toast'
import { Avatar } from '../../components/ui/Avatar'
import { FullPageSpinner } from '../../components/ui/FullPageSpinner'
import { type ChatIdentity, useChat, useUnreadCount } from '../../hooks/chat'
import { useLiveRoom, useNewArrivals, useRankChanges } from '../../hooks/room'
import { useDocumentTitle, useMediaQuery } from '../../hooks/ui'
import { forgetPlayer, getPlayer } from '../../storage/player'
import { isLeaderboardActive } from '../../utils/scoring'
import { presentationTitle } from '../../utils/format'
import { StatusScreen } from '../status/StatusScreen'
import { PlayerFinishedStage } from './PlayerFinishedStage'
import { PlayerLobbyStage } from './PlayerLobbyStage'
import { PlayerPollStage } from './PlayerPollStage'

export default function PlayRoomPage() {
  const { id = '' } = useParams()
  const me = useMemo(() => getPlayer(id), [id])
  const toast = useToast()
  const room = useLiveRoom(id, false)
  const moves = useRankChanges(room.leaderboard?.entries)
  const [visibleTab, setVisibleTab] = useState<SideTab | null>(null)
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const onTab = useCallback((t: SideTab | null) => setVisibleTab(t), [])

  useNewArrivals(room.players, (fresh) => {
    const others = fresh.filter((p) => p.player_id !== me?.player_id)
    if (others.length) toast(others.length === 1 ? `${others[0].player_name} joined` : `${others.length} players joined`, 'join')
  })

  // If the player is looking at chat or another tab, tell them when the
  // host moves on or reveals (on the poll view they see it happen).
  const lastPoll = useRef<{ id: string; revealed: boolean } | null>(null)
  const lookingElsewhere = useRef(false)
  lookingElsewhere.current = !isDesktop && visibleTab !== null
  useEffect(() => {
    const p = room.poll
    if (!p) return
    const prev = lastPoll.current
    if (prev && lookingElsewhere.current) {
      if (prev.id !== p.id) toast('Next question is up!', 'info')
      else if (!prev.revealed && p.revealed) toast('The answer is revealed!', 'info')
    }
    lastPoll.current = { id: p.id, revealed: p.revealed }
  }, [room.poll, toast])

  const chatMe = useMemo<ChatIdentity | null>(
    () => (me ? { role: 'player', id: me.player_id, name: me.player_name, token: me.player_token } : null),
    [me],
  )
  const chat = useChat(id, chatMe)
  const unread = useUnreadCount(chat.messages, chat.loaded, visibleTab === 'chat', me?.player_id)
  useDocumentTitle(room.presentation ? presentationTitle(room.presentation) : 'Play')

  if (!me) return <Navigate to={`/join/${id}`} replace />
  if (room.loading) return <FullPageSpinner />
  if (room.deleted || !room.presentation) {
    return (
      <StatusScreen icon={<X className="size-6" />} title="This game is gone">
        {room.deleted ? 'The host deleted this presentation.' : room.error?.message}
      </StatusScreen>
    )
  }
  const { presentation, poll, votes, leaderboard } = room
  const players = room.players ?? []
  if (room.players && !players.some((p) => p.player_id === me.player_id)) {
    forgetPlayer(id)
    return (
      <StatusScreen icon={<UserX className="size-6" />} title="You were removed" actionTo={`/join/${id}`} actionLabel="Try joining again">
        The host removed you from this presentation.
      </StatusScreen>
    )
  }

  const stage = !presentation.has_started ? (
    <PlayerLobbyStage
      name={me.player_name}
      title={presentationTitle(presentation)}
      names={players.map((p) => p.player_name)}
      prize={presentation.prize}
    />
  ) : presentation.has_finished ? (
    <PlayerFinishedStage leaderboard={leaderboard} meId={me.player_id} name={me.player_name} />
  ) : poll ? (
    <PlayerPollStage
      key={poll.id}
      presentationId={id}
      me={me}
      poll={poll}
      total={presentation.polls.length}
      votes={votes}
      playerCount={players.length}
      leaderboard={leaderboard}
      moves={moves}
      onVoted={room.refetchAll}
    />
  ) : (
    <div className="grid place-items-center py-24 text-ink-300">Waiting for the first question…</div>
  )

  return (
    <PlaygroundShell
      header={
        <RoomHeader
          title={presentationTitle(presentation)}
          status={
            <>
              <RoomStatusBadge presentation={presentation} />
              <ConnectionBadge status={room.status} />
            </>
          }
          actions={
            <span className="flex items-center gap-2 rounded-full border border-white/10 bg-ink-800 py-1 pr-3 pl-1">
              <Avatar name={me.player_name} size={26} />
              <span className="max-w-24 truncate text-sm font-medium sm:max-w-40">{me.player_name}</span>
            </span>
          }
        />
      }
      stage={stage}
      panels={{
        players: (
          <PlayersPanel
            players={players}
            meId={me.player_id}
            votedIds={poll && !presentation.has_finished ? new Set(votes.map((v) => v.player_id)) : undefined}
          />
        ),
        chat: <ChatPanel messages={chat.messages} meId={me.player_id} onSend={chat.send} />,
        leaderboard: <LeaderboardPanel leaderboard={leaderboard} meId={me.player_id} moves={moves} />,
      }}
      playerCount={players.length}
      unreadChat={unread}
      leaderboardActive={isLeaderboardActive(leaderboard)}
      onVisibleTabChange={onTab}
    />
  )
}
