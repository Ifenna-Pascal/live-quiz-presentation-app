import { authorizedRequest, request } from './client'
import type { MyPresentation, Presentation, PresentationInput } from './types'

export function createPresentation(input: PresentationInput) {
  return authorizedRequest<{ presentation_id: string }>('/presentations', { method: 'POST', body: input })
}

/** As the owner the options include the correct answers. */
export function getPresentation(id: string, asOwner = false) {
  const path = `/presentations/${id}`
  return asOwner ? authorizedRequest<Presentation>(path) : request<Presentation>(path)
}

export function listMyPresentations() {
  return authorizedRequest<MyPresentation[]>('/users/me/presentations?limit=100')
}

/** Replaces the title and polls. Only works before the presentation starts. */
export function updatePresentation(id: string, input: PresentationInput) {
  return authorizedRequest<void>(`/presentations/${id}`, { method: 'PUT', body: input })
}

export function startPresentation(id: string) {
  return authorizedRequest<void>(`/presentations/${id}/start`, { method: 'POST' })
}

export function finishPresentation(id: string) {
  return authorizedRequest<void>(`/presentations/${id}/finish`, { method: 'POST' })
}

export function deletePresentation(id: string) {
  return authorizedRequest<void>(`/presentations/${id}`, { method: 'DELETE' })
}
