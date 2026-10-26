import { request } from './client'
import type { Session, User } from './types'

export function signup(name: string, email: string, password: string) {
  return request<User>('/users', { method: 'POST', body: { name, email, password } })
}

export function login(email: string, password: string) {
  return request<Session>('/users/login', { method: 'POST', body: { email, password } })
}

/** Swaps a refresh token for a new pair. The old refresh token stops working. */
export function refreshTokens(refreshToken: string) {
  return request<Session>('/users/token/refresh', { method: 'POST', body: { refresh_token: refreshToken } })
}

export function logout(refreshToken: string) {
  return request<void>('/users/logout', { method: 'POST', body: { refresh_token: refreshToken } })
}
