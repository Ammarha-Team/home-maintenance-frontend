import signupHero from '../../../assets/auth/signup-hero.png'
import PublicLayout from '../../../shared/layouts/PublicLayout.jsx'

// Sign up shell from Figma node 1:457 — illustration card on one side, form card
// on the other, inside the public site chrome. The illustration is dropped below
// lg per the frame note ("Responsive Hidden").
// Each step swaps the illustration, so `visualImage` overrides the default.
// Swapping it re-keys the <img> so the new photo cross-fades over the old one
// instead of cutting.
function SignUpLayout({
  visualTitle,
  visualDescription,
  visualImage = signupHero,
  // Each frame scales and offsets its photo differently (nodes 6:1338, 6:1449,
  // 6:1533) and object-cover cannot express that, so callers pass the frame's
  // own numbers as ratios of the panel width. Top-aligned, as the frames are.
  visualCrop = { width: 1, offsetX: 0 },
  children,
}) {
  return (
    <PublicLayout>
      <div
        dir="rtl"
        className="flex items-stretch justify-center gap-[16px] px-[80px] pt-[24px] pb-[32px]"
      >
        <div className="w-[739px] shrink-0 rounded-[24px] border border-[#e6e8ea] bg-white p-[49px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
          <div className="flex flex-col gap-[32px]">{children}</div>
        </div>

        {/* min-h-full + object-cover on the photo keep it covering the panel
            when the form grows past the image's natural height (validation
            errors on the technician step); at the frame's own proportions the
            width/offset below still drive the crop exactly. */}
        <aside className="relative hidden min-h-[700px] w-[519px] shrink-0 overflow-hidden rounded-[24px] bg-dark shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] lg:block">
          <img
            key={visualImage}
            src={visualImage}
            alt=""
            style={{
              width: `${visualCrop.width * 100}%`,
              left: `${visualCrop.offsetX * 100}%`,
            }}
            className="signup-hero-fade absolute top-0 min-h-full max-w-none object-cover object-top"
          />
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[rgba(0,35,111,0.8)] from-[19.65%] to-[rgba(0,35,111,0)] p-[48px]">
            <h2 className="pb-[16px] text-[29px] font-bold leading-[1.5] text-surface">
              {visualTitle}
            </h2>
            <p className="max-w-[448px] text-[20px] leading-[1.5] text-card opacity-90">
              {visualDescription}
            </p>
          </div>
        </aside>
      </div>
    </PublicLayout>
  )
}

export default SignUpLayout
