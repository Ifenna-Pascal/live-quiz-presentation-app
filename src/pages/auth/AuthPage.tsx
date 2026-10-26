import { type FormEvent, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/context'
import { CenteredShell } from '../../components/layout/CenteredShell'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useDocumentTitle } from '../../hooks/ui'
import { PasswordField } from './PasswordField'

export default function AuthPage({ mode }: { mode: 'login' | 'signup' }) {
  const { user, login, signup } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/dashboard'
  const isSignup = mode === 'signup'
  useDocumentTitle(isSignup ? 'Sign up' : 'Log in')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to={from} replace />

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (password.length < 8) return setError('Password must be at least 8 characters.')
    setLoading(true)
    setError(null)
    try {
      if (isSignup) await signup(name.trim(), email.trim(), password)
      else await login(email.trim(), password)
      navigate(from, { replace: true })
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <CenteredShell>
      <h1 className="font-display text-2xl font-bold">{isSignup ? 'Create your account' : 'Welcome back'}</h1>
      <p className="mt-1 text-sm text-ink-300">
        {isSignup ? 'Host presentations and run live polls.' : 'Log in to manage your presentations.'}
      </p>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {isSignup && (
          <Input label="Name" name="name" required autoComplete="name" placeholder="Ada Lovelace" value={name} onChange={(e) => setName(e.target.value)} />
        )}
        <Input
          label="Email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PasswordField value={password} onChange={setPassword} isNew={isSignup} />
        {error && (
          <p role="alert" className="animate-fade-up rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}
        <Button type="submit" size="lg" loading={loading} className="w-full">
          {isSignup ? 'Create account' : 'Log in'}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-ink-300">
        {isSignup ? 'Already have an account? ' : 'New here? '}
        <Link to={isSignup ? '/login' : '/signup'} state={location.state} className="font-semibold text-brand-400 hover:text-brand-300">
          {isSignup ? 'Log in' : 'Create an account'}
        </Link>
      </p>
    </CenteredShell>
  )
}
