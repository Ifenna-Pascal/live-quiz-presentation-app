import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Avatar } from '../../components/ui/Avatar'
import { Button } from '../../components/ui/Button'

type Props = { presentationId: string; name: string; canSwitch: boolean; onSwitch: () => void }

export function WelcomeBack({ presentationId, name, canSwitch, onSwitch }: Props) {
  return (
    <div className="text-center">
      <Avatar name={name} size={76} className="mx-auto animate-pop" />
      <h1 className="mt-4 font-display text-2xl font-bold">Welcome back, {name}</h1>
      <p className="mt-1 text-sm text-ink-300">You're already in this presentation.</p>
      <Link to={`/play/${presentationId}`} className="mt-6 block">
        <Button size="lg" className="w-full">
          Enter the playground <ArrowRight className="size-4" />
        </Button>
      </Link>
      {canSwitch && (
        <button onClick={onSwitch} className="mt-4 text-sm text-ink-300 hover:text-ink-100">
          Not you? Join with another name
        </button>
      )}
    </div>
  )
}
