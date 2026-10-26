/** The public link players open to join. */
export function joinUrl(presentationId: string) {
  return `${window.location.origin}/join/${presentationId}`
}

const UUID = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i

/** Accepts a full join link or a bare presentation id. */
export function extractPresentationId(input: string) {
  const match = input.match(UUID)
  return match ? match[0].toLowerCase() : null
}
