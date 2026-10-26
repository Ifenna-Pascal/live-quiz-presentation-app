import { type ReactNode, useEffect, useState } from 'react'
import { useMediaQuery } from '../../hooks/ui'
import { cn } from '../../utils/cn'
import { MobileTabBar } from './MobileTabBar'
import type { PlaygroundTab, SideTab } from './playgroundTabs'
import { SideTabBar } from './SideTabBar'

type Props = {
  header: ReactNode
  stage: ReactNode
  panels: Record<SideTab, ReactNode>
  playerCount: number
  unreadChat: number
  leaderboardActive: boolean
  onVisibleTabChange?: (tab: SideTab | null) => void
}

/**
 * Desktop: the poll on the left and a tabbed side panel on the right.
 * Mobile: one view at a time with a bottom tab bar.
 */
export function PlaygroundShell({ header, stage, panels, playerCount, unreadChat, leaderboardActive, onVisibleTabChange }: Props) {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const [mobileTab, setMobileTab] = useState<PlaygroundTab>('stage')
  const [sideTab, setSideTab] = useState<SideTab>('players')

  const visibleSide: SideTab | null = isDesktop ? sideTab : mobileTab === 'stage' ? null : mobileTab
  useEffect(() => onVisibleTabChange?.(visibleSide), [visibleSide, onVisibleTabChange])

  return (
    <div className="flex h-dvh flex-col bg-ink-900">
      {header}
      <div className="relative flex min-h-0 flex-1">
        <div className="glow-top pointer-events-none absolute inset-x-0 top-0 h-96" />
        <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay" />

        <main className={cn('relative min-h-0 flex-1 overflow-y-auto pb-24 lg:pb-8', !isDesktop && mobileTab !== 'stage' && 'hidden')}>
          {stage}
        </main>

        {isDesktop ? (
          <aside className="relative flex w-[400px] shrink-0 flex-col border-l border-white/5 bg-ink-850/70 backdrop-blur xl:w-[440px]">
            <SideTabBar
              active={sideTab}
              onChange={setSideTab}
              unreadChat={unreadChat}
              playerCount={playerCount}
              leaderboardActive={leaderboardActive}
            />
            <div key={sideTab} className="min-h-0 flex-1 animate-fade-in">
              {panels[sideTab]}
            </div>
          </aside>
        ) : (
          mobileTab !== 'stage' && (
            <section key={mobileTab} className="relative min-h-0 flex-1 animate-fade-in pb-[68px]">
              {panels[mobileTab]}
            </section>
          )
        )}
      </div>

      {!isDesktop && (
        <MobileTabBar active={mobileTab} onChange={setMobileTab} unreadChat={unreadChat} leaderboardActive={leaderboardActive} />
      )}
    </div>
  )
}
