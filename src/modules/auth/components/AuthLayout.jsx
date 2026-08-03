import heroImage from '../../../assets/auth/technician-hero.png'
import iconFastService from '../../../assets/auth/icon-fast-service.svg'
import iconVerified from '../../../assets/auth/icon-verified.svg'

// Shared shell for the auth screens (Figma login frame 6:1175). Visual panel on
// the left, form panel on the right; the visual is dropped below lg exactly as
// the frame notes.
//
// The visual panel is half of the frame's 1440, and the cap keeps it near that
// on wider windows — otherwise it would keep growing while the viewport height
// stayed put, forcing the photo into a much deeper crop. 760 buys back some of
// the space between the panel and the form for 40px of extra width; the photo
// gives up about five points of visible height for it, which is the most that
// can be spent before the crop starts to show.
//
// The cap only engages past ~1520px wide — at 1440 and below the panel is half
// the window, exactly as the frame draws it. The panel is pinned to the left
// edge rather than centred, so surplus width lands on the form side, which is
// already painted `surface` and reads as page background.
const VISUAL_PANEL_WIDTH = 760

// Node 6:1177 places the photo 763px wide at x=-31 inside the 720px panel — a
// 5.97% zoom with 31px trimmed off the left. Held as ratios of the panel so the
// crop stays literal at the frame's width and scales with it below that.
const HERO_WIDTH = `${(763 / 720) * 100}%`
const HERO_OFFSET_X = `${(-31 / 720) * 100}%`

const HIGHLIGHTS = [
  { id: 'fast', label: 'خدمة سريعة', icon: iconFastService },
  { id: 'verified', label: 'فنيون معتمدون', icon: iconVerified },
]

function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen w-full bg-surface">
      <div className="auth-rhythm flex min-h-screen w-full font-cairo">
        <section
          style={{ maxWidth: VISUAL_PANEL_WIDTH }}
          className="relative hidden w-1/2 shrink-0 overflow-hidden bg-primary-400 lg:block"
        >
          {/* min-h-full keeps the photo covering the panel on viewports shorter
              than the frame's 1024px, where the width-driven height falls
              short. */}
          <img
            src={heroImage}
            alt=""
            style={{ width: HERO_WIDTH, left: HERO_OFFSET_X }}
            className="absolute top-1/2 min-h-full max-w-none -translate-y-1/2 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,35,111,0.8)] to-[rgba(0,35,111,0)]" />

          {/* Frame 6:1179: content sits 118px in from the right edge and 81px up
              from the bottom, with 16px then 32px gaps. */}
          <div
            dir="rtl"
            className="relative flex h-full flex-col items-start justify-end gap-[16px] pr-[118px] pb-[81px] pl-[48px]"
          >
            <h2 className="max-w-[486px] text-[29px] font-bold leading-[1.5] text-surface">
              أعلى مستويات الجودة في صيانة منزلك
            </h2>
            <p className="max-w-[448px] text-[20px] leading-[1.5] text-card">
              نحن هنا لنضمن بقاء منزلك في أفضل حالاته، مع فريق من الخبراء
              التقنيين المعتمدين.
            </p>

            <ul dir="ltr" className="flex items-center gap-[16px] pt-[16px]">
              {HIGHLIGHTS.map((highlight) => (
                <li
                  key={highlight.id}
                  className="flex items-center gap-[8px] rounded-full border border-white/20 bg-white/10 px-[17px] py-[9px] backdrop-blur-[6px]"
                >
                  <img src={highlight.icon} alt="" className="size-[20px]" />
                  <span className="text-[16px] font-bold leading-[1.5] text-surface">
                    {highlight.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Frame 6:1195: the 596px column sits 46px from the panel's left edge
            and 78px from its right, centred in the 1024px height — 54.5px
            either side, which is 6.75 rhythm units. */}
        <main
          dir="rtl"
          className="flex min-w-0 flex-1 flex-col items-center justify-center bg-surface px-[20px] py-[calc(var(--auth-unit)*6.75)] sm:px-[24px] lg:pr-[78px] lg:pl-[46px]"
        >
          {/* The frame's column is 596 wide. Past 1760 the form side has room
              to spare, so the column takes some of it — that closes the gap on
              both sides at once instead of pushing the form further right.
              Below that the surplus is small enough that widening the fields
              would crowd them against the panel. */}
          <div className="flex w-full max-w-[596px] flex-col gap-[calc(var(--auth-unit)*5)] min-[1760px]:max-w-[680px]">
            <header className="flex flex-col gap-[8px]">
              <h1 className="text-[24px] font-bold leading-[1.5] text-text-500 sm:text-[29px]">
                {title}
              </h1>
              {subtitle ? (
                // Node 6:1200 is a 47px box holding one 30px line, which is
                // what puts the switcher at y=139 in the frame. Below sm the
                // line can wrap, so the box grows with it instead.
                <p className="text-[16px] leading-[1.5] text-accent-600 sm:h-[47px] sm:text-[20px]">
                  {subtitle}
                </p>
              ) : null}
            </header>

            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default AuthLayout
