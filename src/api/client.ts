import { sessionManager } from '../auth/session'

/** An error answered by the API (status > 0) or a network failure (status 0). */
export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/** Where the Go API lives. In development Vite forwards /api to it. */
export const API_BASE_URL = ((import.meta.env.VITE_API_URL as string | undefined) || '/api').replace(/\/$/, '')

export type RequestOptions = {
  method?: string
  body?: unknown
  token?: string | null
}

/** Calls the API and returns the parsed JSON body; throws ApiError on failure. */
export async function request<T>(path: string, { method = 'GET', body, token }: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  let res: Response
  try {
    res = await fetch(API_BASE_URL + path, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError(0, "Can't reach the server. Check your connection.")
  }

  if (res.status === 204) return undefined as T
  const text = await res.text()
  let data: unknown = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = text
  }

  if (!res.ok) {
    const message =
      (data as { error?: string } | null)?.error ||
      (typeof data === 'string' && data) ||
      (res.status === 429 ? 'Too many requests. Slow down a little.' : res.statusText) ||
      'Request failed'
    throw new ApiError(res.status, message)
  }
  return data as T
}

/**
 * Calls the API as the logged-in host. The access token is refreshed
 * silently when it is about to expire, and once more if the API answers 401.
 */
export async function authorizedRequest<T>(path: string, options: Omit<RequestOptions, 'token'> = {}): Promise<T> {
  const token = await sessionManager.getAccessToken()
  if (!token) throw new ApiError(401, 'Your session has ended. Please log in again.')
  try {
    return await request<T>(path, { ...options, token })
  } catch (e) {
    if (!(e instanceof ApiError) || e.status !== 401) throw e
    const fresh = await sessionManager.refresh(true)
    if (!fresh) throw e
    return request<T>(path, { ...options, token: fresh })
  }
}

/** URL of the Server-Sent Events stream of one presentation. */
export function eventsUrl(presentationId: string) {
  return `${API_BASE_URL}/presentations/${presentationId}/events`
}
