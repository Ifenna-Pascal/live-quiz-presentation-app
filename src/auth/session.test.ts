import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '../api/client'
import type { Session } from '../api/types'
import { SessionManager } from './session'

const KEY = 'pollroom:session'

function session(token: string, accessInMs: number): Session {
  return {
    id: 'u1',
    name: 'Ada',
    email: 'ada@example.com',
    access_token: `access-${token}`,
    access_token_expires_at: new Date(Date.now() + accessInMs).toISOString(),
    refresh_token: `refresh-${token}`,
    refresh_token_expires_at: new Date(Date.now() + 7 * 864e5).toISOString(),
  }
}

describe('SessionManager', () => {
  beforeEach(() => localStorage.clear())

  it('returns the current token while it is fresh', async () => {
    localStorage.setItem(KEY, JSON.stringify(session('1', 10 * 60_000)))
    const refresher = vi.fn()
    const m = new SessionManager(refresher)
    expect(await m.getAccessToken()).toBe('access-1')
    expect(refresher).not.toHaveBeenCalled()
  })

  it('refreshes an expiring token once, even when asked many times', async () => {
    localStorage.setItem(KEY, JSON.stringify(session('1', 1000)))
    const refresher = vi.fn().mockResolvedValue(session('2', 15 * 60_000))
    const m = new SessionManager(refresher)
    const tokens = await Promise.all([m.getAccessToken(), m.getAccessToken(), m.getAccessToken()])
    expect(tokens).toEqual(['access-2', 'access-2', 'access-2'])
    expect(refresher).toHaveBeenCalledTimes(1)
    expect(refresher).toHaveBeenCalledWith('refresh-1')
    expect(JSON.parse(localStorage.getItem(KEY)!).refresh_token).toBe('refresh-2')
  })

  it('uses a token another tab already refreshed instead of reusing the old one', async () => {
    localStorage.setItem(KEY, JSON.stringify(session('1', 1000)))
    const refresher = vi.fn()
    const m = new SessionManager(refresher)
    localStorage.setItem(KEY, JSON.stringify(session('other-tab', 15 * 60_000)))
    expect(await m.refresh(true)).toBe('access-other-tab')
    expect(refresher).not.toHaveBeenCalled()
  })

  it('logs out when the refresh token is rejected', async () => {
    localStorage.setItem(KEY, JSON.stringify(session('1', 1000)))
    const m = new SessionManager(vi.fn().mockRejectedValue(new ApiError(401, 'expired')))
    const listener = vi.fn()
    m.subscribe(listener)
    expect(await m.getAccessToken()).toBeNull()
    expect(m.current).toBeNull()
    expect(listener).toHaveBeenCalledWith(null)
  })

  it('keeps the session on network errors', async () => {
    localStorage.setItem(KEY, JSON.stringify(session('1', 1000)))
    const m = new SessionManager(vi.fn().mockRejectedValue(new ApiError(0, 'offline')))
    await expect(m.getAccessToken()).rejects.toThrow('offline')
    expect(m.current?.refresh_token).toBe('refresh-1')
  })
})
