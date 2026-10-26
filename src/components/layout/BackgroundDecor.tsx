/** The grid, glow and grain behind full-page screens. */
export function BackgroundDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(60%_55%_at_50%_0%,black,transparent)]" />
      <div className="glow-top absolute inset-0" />
      <div className="absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-brand-500/10 blur-3xl" />
      <div className="bg-noise absolute inset-0 opacity-[0.035] mix-blend-overlay" />
    </div>
  )
}
