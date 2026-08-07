import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { MapPin, MessageSquare, Phone, X } from 'lucide-react'
import AppLayout from '../../../shared/layouts/AppLayout.jsx'
import Button from '../../../shared/components/Button.jsx'
import Modal from '../../../shared/components/Modal.jsx'
import StatusTimeline from '../components/StatusTimeline.jsx'
import SuccessSeal from '../../../shared/components/SuccessSeal.jsx'
import TechnicianSummaryCard from '../components/TechnicianSummaryCard.jsx'
import { EMERGENCY_ROUTES, REQUEST_STAGES } from '../constants/emergency.js'
import {
  cancelEmergencyRequest,
  FALLBACK_TECHNICIAN,
} from '../services/emergencyService.js'

/**
 * Request tracking.
 *
 * Two things the frame left undrawn are handled here. The cancel action had no
 * confirmation behind it, which is a destructive action one tap away from a
 * stressed user — it now asks first. And the third timeline stage had no
 * active state and no route to the rating screen; completing the job is now an
 * explicit action, which is also the only honest stand-in until a backend can
 * push the status.
 */
function EmergencyTracking() {
  const navigate = useNavigate()
  const { state } = useLocation()

  const technician = state?.technician ?? FALLBACK_TECHNICIAN
  const request = state?.request

  const [stage, setStage] = useState('received')
  const [confirmingCancel, setConfirmingCancel] = useState(false)
  const [cancelling, setCancelling] = useState(false)

  // Stands in for the dispatch push that moves the request along.
  useEffect(() => {
    const timer = setTimeout(() => setStage('enroute'), 4000)
    return () => clearTimeout(timer)
  }, [])

  const activeStage = REQUEST_STAGES.find((item) => item.key === stage)

  const handleCancel = async () => {
    setCancelling(true)
    try {
      await cancelEmergencyRequest(request?.id)
      navigate(EMERGENCY_ROUTES.request, { replace: true })
    } finally {
      setCancelling(false)
    }
  }

  return (
    <AppLayout>
      {/* Bottom padding leaves room for the action bar that is fixed on a
          phone, so the last card is never trapped under it. */}
      <div className="mx-auto w-full max-w-6xl px-4 pt-8 pb-[104px] sm:px-6 md:pt-12 md:pb-12">
        <div className="flex flex-col items-center gap-[10px] text-center">
          <SuccessSeal />

          <h1 className="text-[20px] leading-[1.4] font-bold text-success-800 sm:text-[24px] md:text-[29px]">
            تم إرسال طلب الطوارئ بنجاح
          </h1>

          {request?.id ? (
            <p className="text-[13px] text-text-300 md:text-[14px]">
              رقم الطلب: <span className="font-bold">#{request.id}</span>
            </p>
          ) : null}
        </div>

        {/* Status is announced as it changes — the visual rail alone would not
            reach a user who is not looking at the screen. */}
        <p aria-live="polite" className="sr-only">
          حالة الطلب: {activeStage?.title}
        </p>

        <div className="mt-[28px] grid gap-[16px] md:mt-[36px] lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="flex flex-col gap-[16px]">
            <div className="flex flex-wrap items-center justify-between gap-[10px] rounded-[14px] border border-primary-100 bg-primary-50 p-[14px]">
              <span className="text-[13px] font-bold text-primary-700">
                وقت الوصول المتوقع
              </span>
              <span className="text-[20px] leading-[1.3] font-bold text-primary-700 md:text-[24px]">
                {technician.etaMinutes} دقيقة
              </span>
            </div>

            <TechnicianSummaryCard technician={technician} />

            <div className="overflow-hidden rounded-[14px] border border-line bg-white shadow-card">
              <div
                aria-hidden="true"
                className="relative grid h-[180px] place-items-center bg-card sm:h-[240px]"
              >
                <div className="absolute inset-0 bg-[linear-gradient(0deg,var(--color-line)_1px,transparent_1px),linear-gradient(90deg,var(--color-line)_1px,transparent_1px)] bg-[size:26px_26px] opacity-70" />
                <MapPin size={34} className="relative text-error-500" />
              </div>

              <p className="flex items-center justify-center gap-[8px] border-t border-line px-[14px] py-[12px] text-[13px] text-text-400">
                <span
                  aria-hidden="true"
                  className="size-2 rounded-full bg-success-600"
                />
                {stage === 'enroute'
                  ? 'مباشر: الفني يتحرك الآن'
                  : 'جارٍ تجهيز مسار الفني'}
              </p>
            </div>

            {/* Desktop actions. On a phone the same three live in the fixed bar
                below, where they stay reachable without scrolling back. */}
            <div className="hidden gap-[10px] md:flex">
              <Button variant="primary" icon={MessageSquare} fullWidth>
                مراسلة
              </Button>
              <Button variant="outline" icon={Phone} fullWidth>
                اتصال
              </Button>
              <Button
                variant="danger"
                icon={X}
                fullWidth
                onClick={() => setConfirmingCancel(true)}
              >
                إلغاء
              </Button>
            </div>
          </div>

          <aside className="rounded-[14px] border border-line bg-white p-[16px] shadow-card">
            <h2 className="mb-[16px] text-[15px] leading-[1.5] font-bold text-text-500 md:text-[16px]">
              حالة الطلب
            </h2>

            <StatusTimeline currentStage={stage} />

            {stage === 'enroute' ? (
              <Button
                variant="success"
                size="sm"
                fullWidth
                className="mt-[18px]"
                onClick={() =>
                  navigate(EMERGENCY_ROUTES.rating, { state: { technician } })
                }
              >
                تأكيد اكتمال الخدمة
              </Button>
            ) : null}
          </aside>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 flex gap-[8px] border-t border-line bg-white px-4 py-3 shadow-raised md:hidden">
        <Button variant="primary" size="sm" icon={MessageSquare} fullWidth>
          مراسلة
        </Button>
        <Button variant="outline" size="sm" icon={Phone} fullWidth>
          اتصال
        </Button>
        <Button
          variant="danger"
          size="sm"
          icon={X}
          fullWidth
          onClick={() => setConfirmingCancel(true)}
        >
          إلغاء
        </Button>
      </div>

      <Modal
        open={confirmingCancel}
        onClose={() => setConfirmingCancel(false)}
        size="md"
        title="إلغاء طلب الطوارئ؟"
        description="سيتم إشعار الفني بإلغاء الطلب، ولا يمكن التراجع عن هذا الإجراء."
      >
        <div className="flex flex-col gap-[10px] sm:flex-row-reverse">
          <Button
            variant="danger"
            fullWidth
            disabled={cancelling}
            onClick={handleCancel}
          >
            {cancelling ? 'جارٍ الإلغاء…' : 'نعم، إلغاء الطلب'}
          </Button>
          <Button
            variant="outline"
            fullWidth
            onClick={() => setConfirmingCancel(false)}
          >
            تراجع
          </Button>
        </div>
      </Modal>
    </AppLayout>
  )
}

export default EmergencyTracking
