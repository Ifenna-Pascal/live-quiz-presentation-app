import { ApiError } from '../api/client'
import type { Session } from '../api/types'
import { msUntil } from '../utils/time'
import { readJSON, removeKey, writeJSON } from '../storage/localStorage'
import { refreshTokens } from '../api/auth'

const STORAGE_KEY = 'pollroom:session'
/** Refresh this long before the access token expires. */
const REFRESH_MARGIN_MS = 60_000

type Listener = (session: Session | null) => void
type Refresher = (refreshToken: string) => Promise<Session>

/**
 * Owns the host's tokens. It refreshes the access token silently before it
 * expires and keeps every open tab in sync, so a tab never reuses a refresh
 * token another tab already rotated (the API treats reuse as theft).
 */
export class SessionManager {
  private session: Session | null
  private readonly listeners = new Set<Listener>()
  private refreshing: Promise<string | null> | null = null
  private timer: ReturnType<typeof setTimeout> | undefined
  private readonly refresher: Refresher

  constructor(refresher: Refresher) {
    this.refresher = refresher
    this.session = readJSON<Session | null>(STORAGE_KEY, null)
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key !== STORAGE_KEY) return
        this.session = readJSON<Session | null>(STORAGE_KEY, null)
        this.schedule()
        this.emit()
      })
    }
    this.schedule()
  }

  get current() {
    return this.session
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  set(session: Session) {
    this.session = session
    writeJSON(STORAGE_KEY, session)
    this.schedule()
    this.emit()
  }

  clear() {
    this.session = null
    removeKey(STORAGE_KEY)
    clearTimeout(this.timer)
    this.emit()
  }

  /** A valid access token, refreshed first if it is about to expire. */
  async getAccessToken(): Promise<string | null> {
    const s = this.session
    if (!s) return null
    if (msUntil(s.access_token_expires_at) > REFRESH_MARGIN_MS) return s.access_token
    return this.refresh()
  }

  /** Refreshes once even when many callers ask at the same time. */
  refresh(force = false): Promise<string | null> {
    if (!this.refreshing) {
      this.refreshing = this.refreshAcrossTabs(force).finally(() => {
        this.refreshing = null
      })
    }
    return this.refreshing
  }

  private async refreshAcrossTabs(force: boolean): Promise<string | null> {
    const run = () => this.refreshNow(force)
    if (typeof navigator !== 'undefined' && navigator.locks) {
      return navigator.locks.request('pollroom:refresh', run)
    }
    return run()
  }

  private async refreshNow(force: boolean): Promise<string | null> {
    // Another tab may have refreshed while we waited for the lock.
    const latest = readJSON<Session | null>(STORAGE_KEY, null)
    if (!latest) {
      this.clear()
      return null
    }
    if (latest.refresh_token !== this.session?.refresh_token) {
      this.session = latest
      this.schedule()
      this.emit()
      return latest.access_token
    }
    if (!force && msUntil(latest.access_token_expires_at) > REFRESH_MARGIN_MS) return latest.access_token

    try {
      const next = await this.refresher(latest.refresh_token)
      this.set(next)
      return next.access_token
    } catch (e) {
      // The refresh token is dead: log out. Network errors keep the session.
      if (e instanceof ApiError && (e.status === 401 || e.status === 400)) {
        this.clear()
        return null
      }
      throw e
    }
  }

  private schedule() {
    clearTimeout(this.timer)
    if (!this.session) return
    const wait = Math.max(0, msUntil(this.session.access_token_expires_at) - REFRESH_MARGIN_MS)
    this.timer = setTimeout(() => {
      this.refresh().catch(() => this.schedule())
    }, Math.min(wait, 2 ** 31 - 1))
  }

  private emit() {
    this.listeners.forEach((l) => l(this.session))
  }
}

/** The one session manager of the app. */
export const sessionManager = new SessionManager(refreshTokens)
