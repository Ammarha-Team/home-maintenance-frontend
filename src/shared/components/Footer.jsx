import { Link } from 'react-router-dom'
import logo from '../../assets/brand/logo.png'
import EnvelopeIcon from './icons/EnvelopeIcon.jsx'
import FacebookIcon from './icons/FacebookIcon.jsx'
import InstagramIcon from './icons/InstagramIcon.jsx'
import PhoneIcon from './icons/PhoneIcon.jsx'
import XTwitterIcon from './icons/XTwitterIcon.jsx'

// Site footer from Figma node 1:532 — support/help/quick-link columns beside the
// brand block, on the #abc6f6 → #eaeaea gradient.
const SUPPORT_LINKS = ['مركز المساعده', 'تواصل معنا', 'الاسئله الشائعه']

const QUICK_LINKS = [
  { to: '/', label: 'الرئيسيه' },
  { to: '/services', label: 'الخدمات' },
  { to: '/about', label: 'عن المنصه' },
  { to: '/contact', label: 'تواصل معنا' },
]

const SOCIAL_LINKS = [
  { id: 'twitter', label: 'X', href: '#', Icon: XTwitterIcon },
  { id: 'instagram', label: 'Instagram', href: '#', Icon: InstagramIcon },
  { id: 'facebook', label: 'Facebook', href: '#', Icon: FacebookIcon },
]

const CONTACT_PHONE = '+96643773578817'
const CONTACT_EMAIL = 'support@platform.com'

function Footer() {
  return (
    <footer
      dir="rtl"
      className="flex w-full items-start justify-between bg-gradient-to-t from-[#abc6f6] to-[#eaeaea] pt-[56px] pr-[112px] pb-[80px] pl-[78px]"
    >
      <div className="flex w-[393px] flex-col gap-[16px]">
        <div className="flex flex-col gap-[8px]">
          <img src={logo} alt="عمّرها" className="h-[47px] w-[118px] object-contain" />
          <p className="text-[24px] leading-[1.5] text-[#434655]">
            نغير مفهوم صيانة المنازل في المنطقة لنرتقي بجودة حياتكم.
          </p>
        </div>

        <ul className="flex items-center gap-[12px]">
          {SOCIAL_LINKS.map(({ id, label, href, Icon }) => (
            <li key={id}>
              <a
                href={href}
                aria-label={label}
                className="block text-[#2666d5] transition-opacity hover:opacity-70"
              >
                <Icon className="h-[24px] w-[24px]" />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex w-[620px] items-start justify-end gap-[56px]">
        <div className="flex w-[149px] flex-col gap-[16px]">
          <h2 className="text-[20px] font-bold leading-[1.5] text-text-500">
            اللينكات السريعه
          </h2>
          <ul className="flex flex-col gap-[4px] text-[20px] leading-[1.5] text-text-300">
            {QUICK_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-[16px]">
          <h2 className="w-[158px] text-[20px] font-bold leading-[1.5] text-text-500">
            الدعم والمساعده
          </h2>
          <ul className="flex flex-col gap-[4px] text-[20px] leading-[1.5] text-text-300">
            {SUPPORT_LINKS.map((label) => (
              <li key={label}>{label}</li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-[16px]">
          <h2 className="w-[201px] text-[20px] font-bold leading-[1.5] text-text-500">
            تواصل معنا
          </h2>

          {/* Figma (nodes 1:536 / 1:539) puts each mark on the right of its
              value, i.e. first in this RTL column. */}
          <a
            href={`tel:${CONTACT_PHONE}`}
            className="flex items-center gap-[5px] text-[17px] leading-[1.5] text-[#2666d5]"
          >
            <PhoneIcon className="h-[16px] w-[16px] shrink-0" />
            <span dir="ltr">{CONTACT_PHONE}</span>
          </a>

          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="flex items-center gap-[5px] text-[17px] leading-[1.5] text-[#2666d5]"
          >
            <EnvelopeIcon className="h-[12.8px] w-[16px] shrink-0" />
            <span dir="ltr" className="underline">
              {CONTACT_EMAIL}
            </span>
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
