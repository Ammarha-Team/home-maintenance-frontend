import iconData from '../../../assets/icons/terms-data.svg'
import iconPenalties from '../../../assets/icons/terms-penalties.svg'
import iconQuality from '../../../assets/icons/terms-quality.svg'
import iconWarranty from '../../../assets/icons/terms-warranty.svg'

// Clause cards for the technician joining agreement (Figma node 6:1729): one
// card per clause, its mark in a tinted 40px chip at the right of the heading.
const ICONS = {
  data: iconData,
  quality: iconQuality,
  warranty: iconWarranty,
  penalties: iconPenalties,
}

const TONES = {
  default: 'bg-primary-50',
  danger: 'bg-error-50',
}

function TermsCards({ items }) {
  return (
    <ul className="flex w-full flex-col gap-[12px]">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex flex-col gap-[8px] rounded-[12px] border border-[rgba(197,197,211,0.3)] bg-white p-[16px] drop-shadow-[0px_2px_2px_rgba(30,58,138,0.05)]"
        >
          {/* Icon first so it lands on the right of the heading in RTL. */}
          <div className="flex items-center gap-[10px]">
            <span
              className={`flex size-[32px] shrink-0 items-center justify-center rounded-[8px] ${
                TONES[item.tone ?? 'default']
              }`}
            >
              {/* The exported marks carry their own dimensions, which differ per
                  icon, so they are left at intrinsic size. */}
              <img src={ICONS[item.icon]} alt="" className="max-h-[18px]" />
            </span>
            <h2 className="text-[18px] font-bold leading-[1.5] text-text-400">
              {item.title}
            </h2>
          </div>

          <p className="text-right text-[16px] leading-[1.6] text-accent-600">
            {item.body}
          </p>
        </li>
      ))}
    </ul>
  )
}

export default TermsCards
