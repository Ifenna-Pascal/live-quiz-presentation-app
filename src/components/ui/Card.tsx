import type { HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('surface rounded-2xl bg-ink-850/70 backdrop-blur-sm', className)} {...rest} />
}
