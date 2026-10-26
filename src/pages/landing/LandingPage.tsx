import { AppHeader } from '../../components/layout/AppHeader'
import { useDocumentTitle } from '../../hooks/ui'
import { FeatureGrid } from './FeatureGrid'
import { HeroSection } from './HeroSection'

export default function LandingPage() {
  useDocumentTitle('')
  return (
    <div className="min-h-dvh">
      <AppHeader />
      <HeroSection />
      <FeatureGrid />
    </div>
  )
}
