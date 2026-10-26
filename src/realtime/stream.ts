import { useEffect, useRef, useState } from 'react'
import { eventsUrl } from '../api/client'

/** live: events arrive instantly. reconnecting/offline: the app falls back to polling. */
export type StreamStatus = 'connecting' | 'live' | 'reconnecting' | 'offline'

export type StreamEventType = 'presentation' | 'players' | 'vote' | 'winner' | 'chat' | 'deleted' | 'resync'

/** JSON.parse that returns null instead of throwing. */
export function parseJSON(raw: string): unknown {
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

const EVENT_TYPES: StreamEventType[] = ['presentation', 'players', 'vote', 'winner', 'chat', 'deleted', 'resync']
const RETRY_MS = 4000

type Handler = (data: unknown) => void

/**
 * One EventSource per presentation, shared by every hook that needs it.
 * After each (re)connection it emits "resync" so listeners refetch anything
 * they may have missed while disconnected.
 */
export class PresentationStream {
  status: StreamStatus = 'connecting'
  private source: EventSource | null = null
  private refs = 0
  private retryTimer: ReturnType<typeof setTimeout> | undefined
  private readonly handlers = new Map<StreamEventType, Set<Handler>>()
  private readonly statusListeners = new Set<(s: StreamStatus) => void>()
  private readonly presentationId: string

  constructor(presentationId: string) {
    this.presentationId = presentationId
  }

  retain() {
    if (this.refs++ === 0) this.open()
  }

  release() {
    if (--this.refs === 0) this.close()
  }

  on(type: StreamEventType, handler: Handler) {
    if (!this.handlers.has(type)) this.handlers.set(type, new Set())
    this.handlers.get(type)!.add(handler)
    return () => {
      this.handlers.get(type)?.delete(handler)
    }
  }

  onStatus(listener: (s: StreamStatus) => void) {
    this.statusListeners.add(listener)
    return () => {
      this.statusListeners.delete(listener)
    }
  }

  private open() {
    if (typeof EventSource === 'undefined') {
      this.setStatus('offline')
      return
    }
    const source = new EventSource(eventsUrl(this.presentationId))
    this.source = source
    source.addEventListener('ready', () => {
      this.setStatus('live')
      this.emit('resync', null)
    })
    EVENT_TYPES.forEach((type) =>
      source.addEventListener(type, (e) => this.emit(type, parseJSON((e as MessageEvent).data))),
    )
    source.onerror = () => {
      if (source.readyState === EventSource.CLOSED) {
        // The browser gave up (e.g. a non-stream response): retry ourselves.
        this.setStatus('offline')
        source.close()
        this.retryTimer = setTimeout(() => this.refs > 0 && this.open(), RETRY_MS)
      } else {
        this.setStatus('reconnecting')
      }
    }
  }

  private close() {
    clearTimeout(this.retryTimer)
    this.source?.close()
    this.source = null
    this.setStatus('connecting')
  }

  private emit(type: StreamEventType, data: unknown) {
    this.handlers.get(type)?.forEach((h) => h(data))
  }

  private setStatus(status: StreamStatus) {
    if (this.status === status) return
    this.status = status
    this.statusListeners.forEach((l) => l(status))
  }
}

const streams = new Map<string, PresentationStream>()

/** The shared stream of a presentation (created on first use). */
export function getPresentationStream(presentationId: string) {
  let stream = streams.get(presentationId)
  if (!stream) {
    stream = new PresentationStream(presentationId)
    streams.set(presentationId, stream)
  }
  return stream
}

/** Calls handler for every event of this type on the presentation's stream. */
export function useStreamEvent(presentationId: string, type: StreamEventType, handler: (data: unknown) => void) {
  const ref = useRef(handler)
  ref.current = handler

  useEffect(() => {
    if (!presentationId) return
    const stream = getPresentationStream(presentationId)
    stream.retain()
    const off = stream.on(type, (data) => ref.current(data))
    return () => {
      off()
      stream.release()
    }
  }, [presentationId, type])
}

export function useStreamStatus(presentationId: string): StreamStatus {
  const [status, setStatus] = useState<StreamStatus>(() => getPresentationStream(presentationId).status)

  useEffect(() => {
    const stream = getPresentationStream(presentationId)
    stream.retain()
    setStatus(stream.status)
    const off = stream.onStatus(setStatus)
    return () => {
      off()
      stream.release()
    }
  }, [presentationId])

  return status
}
