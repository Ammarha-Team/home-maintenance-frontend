import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, ShieldCheck, Siren, Wallet } from 'lucide-react'
import AppLayout from '../../../shared/layouts/AppLayout.jsx'
import Button from '../../../shared/components/Button.jsx'
import EmergencyRequestModal from '../components/EmergencyRequestModal.jsx'
import { EMERGENCY_ROUTES } from '../constants/emergency.js'

const ASSURANCES = [
  {
    icon: Clock,
    title: 'وصول خلال 30 دقيقة',
    detail: 'نوجّه الطلب لأقرب فني متاح في نطاقك.',
  },
  {
    icon: ShieldCheck,
    title: 'فنيون موثّقون',
    detail: 'هوية وخبرة موثّقة قبل قبول أي طلب.',
  },
  {
    icon: Wallet,
    title: 'سعر واضح مسبقاً',
    detail: 'تعرف التكلفة قبل تأكيد الطلب.',
  },
]

/**
 * Entry point for the emergency flow.
 *
 * The frame drew this as the dialog floating over the home page, which leaves
 * the request with no address of its own — nothing to link to, and a refresh
 * drops you back on the home screen. It is a route here, and the page behind
 * the dialog carries the context a first-time user needs, so closing the
 * dialog lands somewhere coherent rather than on an unrelated screen.
 */
function EmergencyRequest() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(true)

  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 md:py-12">
        <div className="flex flex-col items-center gap-[14px] text-center">
          <span className="grid size-14 place-items-center rounded-full bg-error-50 text-error-500">
            <Siren size={26} aria-hidden="true" />
          </span>

          <h1 className="text-[22px] leading-[1.4] font-bold text-text-500 sm:text-[28px] md:text-[35px]">
            خدمة الطوارئ
          </h1>

          <p className="max-w-xl text-[14px] leading-[1.7] text-text-300 md:text-[16px]">
            احصل على أقرب فني متاح في أسرع وقت للحالات العاجلة. حدّد نوع المشكلة
            وموقعك، وسنعرض عليك الفنيين المتاحين الآن بأسعارهم.
          </p>

          <Button
            size="lg"
            className="mt-[6px] w-full sm:w-auto sm:min-w-[260px]"
            onClick={() => setOpen(true)}
          >
            ابدأ طلب الطوارئ
          </Button>
        </div>

        <ul className="mt-[36px] grid gap-[14px] sm:grid-cols-3 md:mt-[48px]">
          {ASSURANCES.map(({ icon: Icon, title, detail }) => (
            <li
              key={title}
              className="flex flex-col items-center gap-[8px] rounded-[14px] border border-line bg-white p-[18px] text-center shadow-card"
            >
              <Icon size={22} aria-hidden="true" className="text-primary-600" />
              <p className="text-[15px] leading-[1.5] font-bold text-text-500">
                {title}
              </p>
              <p className="text-[13px] leading-[1.6] text-text-300">{detail}</p>
            </li>
          ))}
        </ul>
      </div>

      <EmergencyRequestModal
        open={open}
        onClose={() => setOpen(false)}
        onConfirmed={({ technician, request }) => {
          setOpen(false)
          navigate(EMERGENCY_ROUTES.tracking, {
            state: { technician, request },
          })
        }}
      />
    </AppLayout>
  )
}

export default EmergencyRequest
