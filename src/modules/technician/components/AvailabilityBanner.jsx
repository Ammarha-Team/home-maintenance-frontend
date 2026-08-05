/**
 * Greeting row with the availability switch (Figma node 21:2066).
 *
 * The switch is a real checkbox rather than a styled div so it keeps the
 * keyboard and screen-reader behaviour of a control; `role="switch"` reports
 * on/off instead of checked/unchecked, which is what the label describes.
 */
function AvailabilityBanner({ name, available, onAvailabilityChange }) {
  return (
    <section className="flex flex-col gap-[20px] rounded-[12px] bg-white p-[24px] shadow-card md:flex-row md:items-center md:justify-between md:p-[40px]">
      {/* The greeting is first in the DOM and the row is not reversed: in an
          RTL row the first child is the rightmost, which is where the frame
          puts the greeting, leaving the switch at the left. Below `md` the two
          stack and the greeting still leads. */}
      <div className="flex flex-col gap-[4px] text-right">
        <h1 className="text-[26px] leading-[1.5] font-bold text-primary-500 md:text-[35px]">
          مرحباً بك، {name}
        </h1>
        <p className="text-[16px] leading-[1.5] text-text-400 md:text-[20px]">
          {available
            ? 'أنت متصل الآن وجاهز لاستقبال الطلبات'
            : 'أنت غير متصل ولن تصلك طلبات جديدة'}
        </p>
      </div>

      <label className="flex w-fit cursor-pointer items-center gap-[12px] rounded-[12px] bg-primary-50 p-[12px]">
        <span className="relative inline-flex h-[32px] w-[56px] shrink-0 items-center">
          <input
            type="checkbox"
            role="switch"
            checked={available}
            onChange={(event) => onAvailabilityChange(event.target.checked)}
            style={{ backgroundColor: available ? '#2a70ea' : '#b7b7b7' }}
            className="size-full cursor-pointer appearance-none rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
          />
          {/* The knob starts at the right — the leading edge in RTL — and
              travels left when the switch turns on.
              Track colour and knob offset are both inline rather than utility
              classes. The class forms this control needs produced no working
              CSS in the build: a probe carrying `-translate-x-[24px]` computed
              `transform: none`, and `checked:bg-primary-500` kept the track
              blue while the input read unchecked. Inline values cannot be
              missed by class generation, and this is the only control on the
              screen that depends on a pseudo-class for its appearance. */}
          <span
            aria-hidden="true"
            style={{ right: available ? '28px' : '4px' }}
            className="pointer-events-none absolute top-[4px] size-[24px] rounded-full bg-white"
          />
        </span>
        <span className="text-[16px] leading-[1.5] text-text-400">
          حالة التوفر
        </span>
      </label>
    </section>
  )
}

export default AvailabilityBanner
