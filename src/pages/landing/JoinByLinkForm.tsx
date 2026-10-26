import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { extractPresentationId } from '../../utils/url'

export function JoinByLinkForm() {
  const navigate = useNavigate()
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)

  return (
    <form
      className="mt-10 max-w-md"
      onSubmit={(e) => {
        e.preventDefault()
        const id = extractPresentationId(value)
        if (!id) return setError('Paste the full join link you were given.')
        navigate(`/join/${id}`)
      }}
    >
      <p className="mb-2 text-sm font-medium text-ink-200">Joining as a player?</p>
      <div className="surface flex gap-2 rounded-2xl bg-ink-850/80 p-1.5">
        <input
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            setError(null)
          }}
          placeholder="Paste your join link"
          aria-label="Join link"
          className="h-11 min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-ink-400"
        />
        <Button type="submit" variant="secondary">
          Join <ArrowRight className="size-4" />
        </Button>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-300">{error}</p>}
    </form>
  )
}
