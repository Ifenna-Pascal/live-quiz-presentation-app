import { Link } from 'react-router-dom'
import { Clock } from 'lucide-react'
import { useAuth } from '../../auth/context'

const WARN_BEFORE_MS = 24 * 60 * 60 * 1000

/**
 * Access tokens refresh silently. The whole session (refresh token) slides
 * forward with use, so this only shows after days of inactivity.
 */
export function SessionExpiryBanner() {
  const { sessionExpiresAt, logout } = useAuth()
  if (!sessionExpiresAt) return null
  const left = Date.parse(sessionExpiresAt) - Date.now()
  if (left > WARN_BEFORE_MS) return null
  const hours = Math.max(1, Math.round(left / 3_600_000))

  return (
    <div className="flex items-center justify-center gap-2 bg-amber-500/10 px-4 py-2 text-center text-xs text-amber-200">
      <Clock className="size-3.5 shrink-0" />
      Your session ends in about {hours}h.
      <Link to="/login" onClick={() => void logout()} className="font-semibold underline underline-offset-2">
        Log in again
      </Link>
    </div>
  )
}
