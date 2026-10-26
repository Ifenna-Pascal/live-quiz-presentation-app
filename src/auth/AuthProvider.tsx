import { type ReactNode, useCallback, useMemo, useSyncExternalStore } from 'react'
import { login as loginRequest, logout as logoutRequest, signup as signupRequest } from '../api/auth'
import { AuthContext } from './context'
import { sessionManager } from './session'

export function AuthProvider({ children }: { children: ReactNode }) {
  const session = useSyncExternalStore(
    (cb) => sessionManager.subscribe(cb),
    () => sessionManager.current,
  )

  const login = useCallback(async (email: string, password: string) => {
    sessionManager.set(await loginRequest(email, password))
  }, [])

  const signup = useCallback(
    async (name: string, email: string, password: string) => {
      await signupRequest(name, email, password)
      await login(email, password)
    },
    [login],
  )

  const logout = useCallback(async () => {
    const refreshToken = sessionManager.current?.refresh_token
    sessionManager.clear()
    if (refreshToken) await logoutRequest(refreshToken).catch(() => {})
  }, [])

  const value = useMemo(
    () => ({
      user: session ? { id: session.id, name: session.name, email: session.email } : null,
      sessionExpiresAt: session?.refresh_token_expires_at ?? null,
      login,
      signup,
      logout,
    }),
    [session, login, signup, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
