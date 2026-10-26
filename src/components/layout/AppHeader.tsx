import { Link, useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAuth } from '../../auth/context'
import { SessionExpiryBanner } from '../feedback/SessionExpiryBanner'
import { Avatar } from '../ui/Avatar'
import { Button } from '../ui/Button'
import { Logo } from '../ui/Logo'

export function AppHeader() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  return (
    <header className="sticky top-0 z-20 border-b border-white/5 bg-ink-900/70 backdrop-blur-xl">
      <SessionExpiryBanner />
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to={user ? '/dashboard' : '/'} aria-label="Home">
          <Logo />
        </Link>
        {user ? (
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-ink-400">{user.email}</p>
            </div>
            <Avatar name={user.name} />
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => {
                await logout()
                navigate('/')
              }}
              aria-label="Log out"
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Log out</span>
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">Get started</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
