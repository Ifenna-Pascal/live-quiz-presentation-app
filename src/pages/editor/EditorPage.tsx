import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Lock, Plus, Sparkles } from 'lucide-react'
import { createPresentation, getPresentation, updatePresentation } from '../../api/presentations'
import { AppHeader } from '../../components/layout/AppHeader'
import { useToast } from '../../components/toast/toast'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { FullPageSpinner } from '../../components/ui/FullPageSpinner'
import { useDocumentTitle } from '../../hooks/ui'
import { useResource } from '../../hooks/useResource'
import { blankPoll, type DraftPoll, type DraftPrize, draftToInput, findDraftProblems, isPrizeInvalid, moveItem, NO_PRIZE, presentationToDraft, prizeToDraft, samplePolls, uid } from './draft'
import { EditorFooter } from './EditorFooter'
import { PollEditorCard } from './PollEditorCard'
import { PrizeEditor } from './PrizeEditor'

/** Creates a presentation, or edits one (/presentations/:id/edit) before it starts. */
export default function EditorPage() {
  const { id } = useParams()
  const editing = !!id
  useDocumentTitle(editing ? 'Edit presentation' : 'New presentation')
  const toast = useToast()
  const navigate = useNavigate()
  const existing = useResource(() => getPresentation(id!, true), [id], editing)

  const [title, setTitle] = useState('')
  const [polls, setPolls] = useState<DraftPoll[]>(() => [blankPoll()])
  const [prize, setPrize] = useState<DraftPrize>(NO_PRIZE)
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!existing.data) return
    setTitle(existing.data.title)
    setPolls(presentationToDraft(existing.data))
    setPrize(prizeToDraft(existing.data.prize))
  }, [existing.data])

  if (editing && existing.loading && !existing.data) return <FullPageSpinner />
  if (editing && existing.data && (existing.data.has_started || !existing.data.is_owner)) {
    return (
      <div className="min-h-dvh">
        <AppHeader />
        <EmptyState icon={<Lock className="size-6" />} title={existing.data.is_owner ? 'Already started' : 'Not your presentation'}>
          {existing.data.is_owner ? 'A presentation can only be edited before it starts.' : 'Only the owner can edit it.'}
          <Link to="/dashboard" className="mt-5 block">
            <Button variant="secondary">Back to dashboard</Button>
          </Link>
        </EmptyState>
      </div>
    )
  }

  const problems = findDraftProblems(polls)
  const valid = problems.every((p) => !p.question && !p.options && !p.time)
  const update = (pollId: string, next: DraftPoll) => setPolls((ps) => ps.map((p) => (p.id === pollId ? next : p)))

  async function save() {
    setSubmitted(true)
    if (!valid) return toast('Every question needs text, at least two answers and 5–600 seconds.', 'error')
    if (isPrizeInvalid(prize)) return toast('Enter a prize amount, or turn prize money off.', 'error')
    setSaving(true)
    try {
      const input = draftToInput(title, polls, prize)
      if (editing) {
        await updatePresentation(id!, input)
        toast('Changes saved', 'success')
        navigate(`/host/${id}`)
      } else {
        const { presentation_id } = await createPresentation(input)
        toast('Presentation created. Share the link to let players in!', 'success')
        navigate(`/host/${presentation_id}`)
      }
    } catch (e) {
      toast((e as Error).message, 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="relative min-h-dvh pb-28">
      <div className="glow-top pointer-events-none absolute inset-x-0 top-0 h-96" />
      <AppHeader />
      <main className="relative mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-ink-300 hover:text-ink-100">
          <ArrowLeft className="size-4" /> Back
        </Link>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight">{editing ? 'Edit presentation' : 'New presentation'}</h1>
            <p className="mt-1 text-sm text-ink-300">
              Every question is timed. Tick the correct answer: the first player to pick it wins the point.
            </p>
          </div>
          {!editing && (
            <Button variant="secondary" size="sm" onClick={() => setPolls(samplePolls())}>
              <Sparkles className="size-4 text-brand-400" /> Use sample quiz
            </Button>
          )}
        </div>

        <Card className="mt-6 p-5">
          <label className="block">
            <span className="text-sm font-medium text-ink-200">Title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              placeholder="Friday tech quiz"
              className="mt-1.5 w-full border-0 bg-transparent font-display text-2xl font-semibold outline-none placeholder:text-ink-500"
            />
          </label>
        </Card>

        <PrizeEditor prize={prize} onChange={setPrize} invalid={submitted && isPrizeInvalid(prize)} />

        <ol className="mt-4 space-y-4">
          {polls.map((poll, index) => (
            <li key={poll.id}>
              <PollEditorCard
                poll={poll}
                index={index}
                count={polls.length}
                problem={submitted ? problems[index] : null}
                onChange={(next) => update(poll.id, next)}
                onMove={(by) => setPolls((ps) => moveItem(ps, index, by))}
                onDuplicate={() =>
                  setPolls((ps) => [
                    ...ps.slice(0, index + 1),
                    { ...poll, id: uid(), options: poll.options.map((o) => ({ ...o, id: uid() })) },
                    ...ps.slice(index + 1),
                  ])
                }
                onDelete={() => setPolls((ps) => ps.filter((p) => p.id !== poll.id))}
                onApplyTimeToAll={() => {
                  setPolls((ps) => ps.map((p) => ({ ...p, timeLimit: poll.timeLimit })))
                  toast(`Every question now has ${poll.timeLimit} seconds`, 'info')
                }}
              />
            </li>
          ))}
        </ol>

        <button
          type="button"
          onClick={() => setPolls((ps) => [...ps, blankPoll()])}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-ink-600 py-5 text-sm font-medium text-ink-300 transition-colors hover:border-brand-500/60 hover:text-brand-300"
        >
          <Plus className="size-5" /> Add question
        </button>
      </main>

      <EditorFooter
        pollCount={polls.length}
        scoredCount={polls.filter((p) => p.options.some((o) => o.correct)).length}
        saving={saving}
        label={editing ? 'Save changes' : 'Create presentation'}
        onSave={save}
      />
    </div>
  )
}
