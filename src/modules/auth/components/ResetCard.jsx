// The card the three reset steps share (Figma nodes 14:813, 14:820, 14:840):
// white fill, hairline border, 12px radius, 32px padding, centred heading pair.
//
// One step is on screen at a time, so the card carries no state of its own —
// which step is showing is the page's business.
function ResetCard({ title, subtitle, gap = 24, children }) {
  return (
    <section
      style={{ gap }}
      className="flex w-full flex-col items-center rounded-[12px] border border-line bg-white p-[20px] drop-shadow-[0px_4px_6px_rgba(37,99,235,0.06)] sm:p-[32px]"
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
