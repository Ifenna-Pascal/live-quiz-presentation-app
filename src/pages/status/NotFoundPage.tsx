import { Compass } from 'lucide-react'
import { StatusScreen } from './StatusScreen'

export default function NotFoundPage() {
  return <StatusScreen icon={<Compass className="size-6" />} title="Page not found" />
}
