import { cn } from '../../utils/cn'
import { SIDE_TABS, type SideTab } from './playgroundTabs'
import { TabBadge } from './TabBadge'

type Props = {
  active: SideTab
  onChange: (tab: SideTab) => void
  unreadChat: number
  playerCount: number
  leaderboardActive: boolean
}

export function SideTabBar({ active, onChange, ...badges }: Props) {
  return (
    <div className="flex gap-1 border-b border-white/5 p-2" role="tablist">
      {SIDE_TABS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          role="tab"
          aria-selected={active === id}
          onClick={() => onChange(id)}
          className={cn(
            'relative flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-all',
            active === id ? 'bg-ink-700 text-ink-100 shadow-inner' : 'text-ink-300 hover:bg-ink-800 hover:text-ink-100',
          )}
        >
          <Icon className={cn('size-4', active === id && 'text-brand-400')} />
          {label}
          <TabBadge tab={id} {...badges} />
        </button>
      ))}
    </div>
  )
}
