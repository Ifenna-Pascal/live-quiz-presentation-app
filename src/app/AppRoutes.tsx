import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '../auth/ProtectedRoute'
import { FullPageSpinner } from '../components/ui/FullPageSpinner'
import LandingPage from '../pages/landing/LandingPage'

// Pages load on demand so the first screen stays light.
const AuthPage = lazy(() => import('../pages/auth/AuthPage'))
const DashboardPage = lazy(() => import('../pages/dashboard/DashboardPage'))
const EditorPage = lazy(() => import('../pages/editor/EditorPage'))
const HostRoomPage = lazy(() => import('../pages/host/HostRoomPage'))
const JoinPage = lazy(() => import('../pages/join/JoinPage'))
const PlayRoomPage = lazy(() => import('../pages/play/PlayRoomPage'))
const NotFoundPage = lazy(() => import('../pages/status/NotFoundPage'))

export function AppRoutes() {
  return (
    <Suspense fallback={<FullPageSpinner />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/signup" element={<AuthPage mode="signup" />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/presentations/new" element={<ProtectedRoute><EditorPage /></ProtectedRoute>} />
        <Route path="/presentations/:id/edit" element={<ProtectedRoute><EditorPage /></ProtectedRoute>} />
        <Route path="/host/:id" element={<ProtectedRoute><HostRoomPage /></ProtectedRoute>} />
        <Route path="/join/:id" element={<JoinPage />} />
        <Route path="/play/:id" element={<PlayRoomPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
