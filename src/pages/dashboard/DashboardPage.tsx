import { Link } from 'react-router-dom'
import { LayoutGrid, Plus } from 'lucide-react'
import { deletePresentation, listMyPresentations } from '../../api/presentations'
import { useAuth } from '../../auth/context'
import { AppHeader } from '../../components/layout/AppHeader'
import { useToast } from '../../components/toast/toast'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { Spinner } from '../../components/ui/Spinner'
import { useDocumentTitle } from '../../hooks/ui'
import { useResource } from '../../hooks/useResource'
import { DashboardStats } from './DashboardStats'
import { NewPresentationTile } from './NewPresentationTile'
import { PresentationCard } from './PresentationCard'

export default function DashboardPage() {
  useDocumentTitle('Dashboard')
  const { user } = useAuth()
  const toast = useToast()
  const { data, error, loading, setData } = useResource(listMyPresentations, [user?.id])
  const items = data ?? []

  async function onDelete(id: string) {
    try {
      await deletePresentation(id)
      setData((prev = []) => prev.filter((p) => p.id !== id))
      toast('Presentation deleted', 'info')
    } catch (e) {
      toast((e as Error).message, 'error')
    }
  }

  return (
    <div className="relative min-h-dvh">
      <div className="glow-top pointer-events-none absolute inset-x-0 top-0 h-96" />
      <AppHeader />
      <main className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-ink-300">Hi {user?.name.split(' ')[0]} 👋</p>
            <h1 className="mt-1 font-display text-4xl font-bold tracking-tight">Your presentations</h1>
          </div>
          <Link to="/presentations/new">
            <Button size="lg" className="w-full sm:w-auto">
              <Plus className="size-5" /> New presentation
            </Button>
          </Link>
        </div>

        {!!items.length && <DashboardStats items={items} />}

        <div className="mt-8">
          {loading && !data ? (
            <div className="grid place-items-center py-20">
              <Spinner className="size-7" />
            </div>
          ) : error && !data ? (
            <Card className="p-6 text-sm text-red-300">{error.message}</Card>
          ) : !items.length ? (
            <Card>
              <EmptyState icon={<LayoutGrid className="size-6" />} title="No presentations yet">
                <p>Create your first quiz, then share the link with your audience.</p>
                <Link to="/presentations/new" className="mt-5 inline-block">
                  <Button>
                    <Plus className="size-4" /> Create presentation
                  </Button>
                </Link>
              </EmptyState>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <NewPresentationTile />
              {items.map((p, i) => (
                <PresentationCard key={p.id} p={p} index={i} onDelete={onDelete} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
