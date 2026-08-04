import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import iconUpdated from '../../../assets/icons/terms-updated.svg'
import PublicLayout from '../../../shared/layouts/PublicLayout.jsx'
import SignUpStepper from '../components/SignUpStepper.jsx'
import TermsCards from '../components/TermsCards.jsx'
import TermsConsent from '../components/TermsConsent.jsx'
import {
  CONSENT_LABEL,
  TECHNICIAN_TERMS,
  TERMS_UPDATED_LABEL,
} from '../constants/terms.js'
import { registerTechnician } from '../services/authService.js'

// Figma: "Create an account (for the technician)" step 3 of 3 (node 6:1663).
// Unlike the other sign up steps this frame has no illustration panel — the
// agreement fills a single full-width card.
function TechnicianSignUpTerms() {
  const location = useLocation()
  const navigate = useNavigate()
  const [accepted, setAccepted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // Step 2 hands the collected fields over through router state.
  const details = location.state?.details

  const handleSubmit = async () => {
    setSubmitting(true)
    setSubmitError('')

    try {
      await registerTechnician(details)
      // Last step of the flow — the account exists, so the new technician goes
      // straight to their home area. `replace` keeps the agreement step out of
      // the history, which would otherwise re-submit on a back navigation.
      navigate('/home', { replace: true })
    } catch {
      setSubmitError('تعذر إنشاء الحساب، حاول مرة أخرى لاحقًا.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PublicLayout>
      {/* Narrower than the frame's full 1280px card by request — it read as
          oversized, and the shorter measure is easier to read. */}
      <div dir="rtl" className="mx-auto max-w-[960px] px-[24px] pt-[32px] pb-[96px]">
        <div className="flex flex-col gap-[24px] rounded-[24px] border border-[#e6e8ea] bg-white p-[32px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
          <div className="mx-auto w-full max-w-[520px]">
            <SignUpStepper currentStep={3} />
          </div>

          <header className="flex w-full flex-col items-start gap-[16px]">
            <div className="flex w-full flex-col gap-[4px]">
              <h1 className="text-right text-[24px] font-bold leading-[1.5] text-text-500">
                اتفاقية وشروط انضمام الفنيين
              </h1>
              <p className="text-right text-[16px] leading-[1.5] text-accent-600">
                يرجى مراجعة البنود القانونية والمهنية التالية بعناية لضمان
                استمرارية عضويتك في منصة صيانة.
              </p>
            </div>

            <p className="flex items-center gap-[8px] rounded-full bg-primary-100 px-[12px] py-[4px] text-[16px] leading-[1.5] text-primary-900">
              <img src={iconUpdated} alt="" />
              {TERMS_UPDATED_LABEL}
            </p>
          </header>

          <TermsConsent
            accepted={accepted}
            onAcceptedChange={setAccepted}
            consentLabel={CONSENT_LABEL}
            submitLabel="إنشاء حساب جديد"
            onSubmit={handleSubmit}
            submitError={submitError}
            submitting={submitting}
            contentGap={32}
            actionsGap={24}
          >
            <TermsCards items={TECHNICIAN_TERMS} />
          </TermsConsent>
        </div>
      </div>
    </PublicLayout>
  )
}

export default TechnicianSignUpTerms
