import { useCallback, useState } from 'react'
import { removePlayer as removePlayerRequest } from '../api/players'
import { nextPoll, previousPoll, revealPoll } from '../api/polls'
import { finishPresentation, startPresentation } from '../api/presentations'
import { useToast } from '../components/toast/toast'

export type HostAction = 'start' | 'next' | 'previous' | 'reveal' | 'finish'

/** The host's controls. Each one refreshes the room after it succeeds. */
export function useHostActions(presentationId: string, refresh: () => void) {
  const toast = useToast()
  const [busy, setBusy] = useState<HostAction | null>(null)

  const run = useCallback(
    async (action: HostAction, call: () => Promise<unknown>, success?: string) => {
      setBusy(action)
      try {
        await call()
        if (success) toast(success, 'success')
        refresh()
      } catch (e) {
        toast((e as Error).message, 'error')
      } finally {
        setBusy(null)
      }
    },
    [refresh, toast],
  )

  return {
    busy,
    start: () => run('start', () => startPresentation(presentationId), "You're live! Registration is closed."),
    next: () => run('next', () => nextPoll(presentationId)),
    previous: () => run('previous', () => previousPoll(presentationId)),
    reveal: () => run('reveal', () => revealPoll(presentationId)),
    finish: () => run('finish', () => finishPresentation(presentationId), "That's a wrap! Final standings are in."),
    removePlayer: async (playerId: string, name: string) => {
      try {
        await removePlayerRequest(presentationId, playerId)
        toast(`${name} was removed`, 'info')
        refresh()
      } catch (e) {
        toast((e as Error).message, 'error')
      }
    },
  }
}
