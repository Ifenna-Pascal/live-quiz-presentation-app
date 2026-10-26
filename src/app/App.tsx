import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../auth/AuthProvider'
import { ErrorBoundary } from '../components/feedback/ErrorBoundary'
import { ToastProvider } from '../components/toast/ToastProvider'
import { AppRoutes } from './AppRoutes'

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ToastProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </ToastProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
