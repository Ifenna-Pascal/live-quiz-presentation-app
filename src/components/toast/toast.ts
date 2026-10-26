import { createContext, useContext } from 'react'

export type ToastTone = 'success' | 'error' | 'info' | 'join'
export type Toast = { id: number; tone: ToastTone; message: string }

export const ToastContext = createContext<(message: string, tone?: ToastTone) => void>(() => {})

export function useToast() {
  return useContext(ToastContext)
}
