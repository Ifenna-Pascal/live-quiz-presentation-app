import { cn } from '../../utils/cn'
import { SIDE_TABS, STAGE_TAB, type PlaygroundTab } from './playgroundTabs'

type Props = { active: PlaygroundTab; onChange: (tab: PlaygroundTab) => void; unreadChat: number; leaderboardActive: boolean }

export function MobileTabBar({ active, onChange, unreadChat, leaderboardActive }: Props) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-white/5 bg-ink-900/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl">
      <div className="grid grid-cols-4">
        {[STAGE_TAB, ...SIDE_TABS].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            aria-current={active === id}
            className={cn(
              'relative flex h-[68px] flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors',
              active === id ? 'text-brand-400' : 'text-ink-300',
            )}
          >
            {active === id && <span className="absolute top-0 h-0.5 w-10 rounded-full bg-brand-500 shadow-[0_0_10px_#ff7a1a]" />}
            <span className="relative">
              <Icon className="size-5" />
              {id === 'chat' && unreadChat > 0 && (
                <span className="absolute -top-1.5 -right-2.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand-500 px-1 text-[9px] font-bold text-ink-950">
                  {unreadChat > 9 ? '9+' : unreadChat}
                </span>
              )}
              {id === 'leaderboard' && leaderboardActive && (
                <span className="absolute -top-0.5 -right-1 size-2 animate-glow rounded-full bg-brand-400" />
              )}
            </span>
            {label}
          </button>
        ))}
      </div>
    </nav>
  )
}
