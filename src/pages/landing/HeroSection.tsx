import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useAuth } from '../../auth/context'
import { BackgroundDecor } from '../../components/layout/BackgroundDecor'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { HeroPreview } from './HeroPreview'
import { JoinByLinkForm } from './JoinByLinkForm'

export function HeroSection() {
  const { user } = useAuth()
  return (
    <section className="relative overflow-hidden">
      <BackgroundDecor />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 pt-14 pb-20 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:pt-24">
        <div className="animate-fade-up">
          <Badge tone="brand" dot>
            Live, interactive presentations
          </Badge>
          <h1 className="mt-6 font-display text-5xl leading-[1.02] font-bold tracking-tight text-balance sm:text-7xl">
            Turn your audience into <span className="text-gradient">players.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-300">
            Build a quiz, share one link, and run the room: instant votes, a group chat and a leaderboard that lights up the moment
            someone gets it right.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to={user ? '/presentations/new' : '/signup'}>
              <Button size="xl" className="w-full sm:w-auto">
                Create a presentation <ArrowRight className="size-4" />
              </Button>
            </Link>
            {user && (
              <Link to="/dashboard">
                <Button size="xl" variant="secondary" className="w-full sm:w-auto">
                  My presentations
                </Button>
              </Link>
            )}
          </div>
          <JoinByLinkForm />
        </div>
        <HeroPreview />
      </div>
    </section>
  )
}
