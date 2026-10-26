/** Currencies a host can pick for prize money (must match the API). */
export const PRIZE_CURRENCIES = ['NGN'] as const

/** formatMoney(50000, 'NGN') → "₦50,000". Whole units, no decimals. */
export function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      currencyDisplay: 'narrowSymbol',
      maximumFractionDigits: 0,
    }).format(amount)
  } catch {
    return `${currency} ${amount.toLocaleString()}`
  }
}

/** The currency symbol on its own, e.g. "₦". */
export function currencySymbol(currency: string) {
  return formatMoney(0, currency).replace(/[\d\s.,]/g, '') || currency
}

/** 1 → "1st", 2 → "2nd", 11 → "11th". */
export function ordinal(n: number) {
  const tens = n % 100
  if (tens >= 11 && tens <= 13) return `${n}th`
  return `${n}${({ 1: 'st', 2: 'nd', 3: 'rd' } as Record<number, string>)[n % 10] ?? 'th'}`
}

/** pluralize(1, 'player') → "1 player", pluralize(3, 'player') → "3 players". */
export function pluralize(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase()
}

/** A stable hue per name, so a player keeps their colour everywhere. */
export function nameHue(name: string) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return h % 360
}

export function presentationTitle(p: { id: string; title: string }) {
  return p.title.trim() || `Untitled · ${p.id.slice(0, 4).toUpperCase()}`
}
