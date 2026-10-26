import { Eye } from 'lucide-react'
import { Badge } from '../ui/Badge'
import { QuestionDots } from './QuestionDots'

type Props = { index: number; total: number; revealed: boolean; right?: React.ReactNode }

export function QuestionHeader({ index, total, revealed, right }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Badge tone="brand">
          Question {index} of {total}
        </Badge>
        {revealed && (
          <Badge tone="green">
            <Eye className="size-3" /> Answer revealed
          </Badge>
        )}
      </div>
      {right ?? <QuestionDots index={index} total={total} />}
    </div>
  )
}
