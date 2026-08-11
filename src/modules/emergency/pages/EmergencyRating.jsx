import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Send } from 'lucide-react'
import AppLayout from '../../../shared/layouts/AppLayout.jsx'
import Button from '../../../shared/components/Button.jsx'
import Textarea from '../../../shared/components/Textarea.jsx'
import RatingStars from '../../reviews/components/RatingStars.jsx'
import SuccessSeal from '../../../shared/components/SuccessSeal.jsx'
import TechnicianSummaryCard from '../components/TechnicianSummaryCard.jsx'
import {
  submitEmergencyRating,
  FALLBACK_TECHNICIAN,
} from '../services/emergencyService.js'

/**
 * Service completion and technician rating.
 *
 * The frame had one screen state: an empty form. A rating that cannot be
 * submitted, cannot fail and cannot be skipped is not a flow, so the score is
 * required before submit acts, the request reports its own progress, and there
 * is a way out for someone who does not want to rate now.
 */
function EmergencyRating() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const technician = state?.technician ?? FALLBACK_TECHNICIAN

  const [score, setScore] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (score === 0) {
      setError('اختر عدد النجوم أولاً.')
      return
    }

    setError('')
    setSubmitting(true)
    try {
      await submitEmergencyRating({
        technicianId: technician.id,
        score,
        comment,
      })
      setSubmitted(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 md:py-12">
        <div className="flex flex-col items-center gap-[10px] text-center">
          <SuccessSeal />

          <h1 className="text-[20px] leading-[1.4] font-bold text-success-800 sm:text-[24px] md:text-[29px]">
            تم اكتمال الخدمة بنجاح
          </h1>

          <p className="max-w-md text-[14px] leading-[1.7] text-text-300 md:text-[16px]">
            شكراً لاختيارك لنا. نأمل أن تكون الخدمة نالت رضاك.
          </p>
        </div>

        <TechnicianSummaryCard
          technician={technician}
          className="mt-[24px] md:mt-[32px]"
        />

        {submitted ? (
          <div
            role="status"
            className="mt-[16px] flex flex-col items-center gap-[14px] rounded-[14px] border border-success-200 bg-success-100 p-[20px] text-center"
          >
            <p className="text-[15px] leading-[1.6] font-bold text-success-800">
              وصلنا تقييمك. شكراً لوقتك.
            </p>
            <Button
              variant="primary"
              fullWidth
              className="sm:w-auto sm:min-w-[220px]"
              onClick={() => navigate('/home')}
            >
              العودة للرئيسية
            </Button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-[16px] flex flex-col gap-[18px] rounded-[14px] border border-line bg-white p-[18px] shadow-card md:p-[22px]"
          >
            <div>
              <h2 className="text-center text-[16px] leading-[1.5] font-bold text-text-500 md:text-[20px]">
                تقييم الفني
              </h2>

              <div className="mt-[10px]">
                <RatingStars value={score} onChange={setScore} name="rating" />
              </div>

              {error ? (
                <p
                  role="alert"
                  className="mt-[6px] text-center text-[12px] font-bold text-error-500"
                >
                  {error}
                </p>
              ) : null}
            </div>

            <Textarea
              label="شاركنا تجربتك"
              rows={4}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="اكتب تعليقك هنا…"
              hint="اختياري — يساعد غيرك على الاختيار."
            />

            <div className="flex flex-col gap-[10px] sm:flex-row-reverse">
              <Button
                type="submit"
                size="lg"
                fullWidth
                icon={Send}
                disabled={submitting}
              >
                {submitting ? 'جارٍ الإرسال…' : 'إرسال التقييم'}
              </Button>

              <Button
                type="button"
                variant="outline"
                size="lg"
                fullWidth
                onClick={() => navigate('/home')}
              >
                لاحقاً
              </Button>
            </div>
          </form>
        )}
      </div>
    </AppLayout>
  )
}

export default EmergencyRating
