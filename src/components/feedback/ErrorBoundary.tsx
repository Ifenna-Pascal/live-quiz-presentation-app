import { Component, type ErrorInfo, type ReactNode } from 'react'
import { RotateCcw, TriangleAlert } from 'lucide-react'

type State = { error: Error | null }

/** Shows a recovery screen instead of a blank page when rendering crashes. */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled UI error', error, info.componentStack)
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="grid min-h-dvh place-items-center px-6 text-center">
        <div>
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-red-500/10 text-red-300">
            <TriangleAlert className="size-6" />
          </div>
          <h1 className="mt-5 font-display text-2xl font-bold">Something broke on this screen</h1>
          <p className="mt-2 text-sm text-ink-300">Your game is safe on the server. Reload to jump back in.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-brand-500 px-5 text-sm font-semibold text-ink-950 hover:bg-brand-400"
          >
            <RotateCcw className="size-4" /> Reload
          </button>
        </div>
      </div>
    )
  }
}
