import { createContext, useContext } from 'react'
import type { User } from '../api/types'

export type AuthValue = {
  user: User | null
  /** When the refresh token (the whole session) expires. */
  sessionExpiresAt: string | null
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthValue | null>(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
