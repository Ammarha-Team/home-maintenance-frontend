// The card the three reset steps share (Figma nodes 14:813, 14:820, 14:840):
// white fill, hairline border, 12px radius, 32px padding, centred heading pair.
//
// `locked` is what keeps the page honest. The frame shows all three steps at
// once, so the later ones are on screen before they can be used; dimming and
// inerting them says so without moving anything, and keeps a keyboard out of
// fields the flow has not reached yet.
function ResetCard({ title, subtitle, locked = false, gap = 24, children }) {
  return (
    <section
      aria-disabled={locked || undefined}
      // `inert` takes a whole subtree out of focus order and the accessibility
      // tree at once, which a `disabled` on each control would not do.
      inert={locked ? true : undefined}
      style={{ gap }}
      className={`flex w-full flex-col items-center rounded-[12px] border border-line bg-white p-[20px] drop-shadow-[0px_4px_6px_rgba(37,99,235,0.06)] transition-opacity duration-300 sm:p-[32px] ${
        locked ? 'opacity-55' : 'opacity-100'
      }`}
    >
      <header className="flex w-full flex-col items-center gap-[8px] text-center">
        <h2 className="w-full text-[20px] font-bold leading-[1.5] text-text-500 sm:text-[24px]">
          {title}
        </h2>
        <p className="w-full text-[16px] leading-[1.5] text-accent-600 sm:text-[20px]">
          {subtitle}
        </p>
      </header>

      {children}
    </section>
  )
}

export default ResetCard
