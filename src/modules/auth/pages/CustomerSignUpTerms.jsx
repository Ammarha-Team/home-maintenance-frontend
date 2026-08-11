import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import termsHero from '../../../assets/auth/terms-hero.png'
import AccountCreatedPanel from '../components/AccountCreatedPanel.jsx'
import SignUpLayout from '../components/SignUpLayout.jsx'
import SignUpStepper from '../components/SignUpStepper.jsx'
import TermsConsent from '../components/TermsConsent.jsx'
import TermsList from '../components/TermsList.jsx'
import { CONSENT_LABEL, CUSTOMER_TERMS } from '../constants/terms.js'
import { registerCustomer } from '../services/authService.js'
import { landingRouteFor, saveSession } from '../services/authSession.js'

// Hero crop from node 6:1449 — 913px wide at x=-198 over the 517px panel.
const TERMS_HERO_CROP = { width: 913 / 517, offsetX: -198 / 517 }

// Figma: "Create an account (for the customer)" step 3 of 3 (node 6:1446)
function CustomerSignUpTerms() {
  const location = useLocation()
  const navigate = useNavigate()
  const [accepted, setAccepted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [created, setCreated] = useState(false)

  // Step 2 hands the collected fields over through router state.
  const details = location.state?.details

  const handleSubmit = async () => {
    setSubmitting(true)
    setSubmitError('')

    try {
      const result = await registerCustomer(details)

      // If registration ever returns a session, the role inside it decides
      // where the account lands — through the same helper login uses, so no
      // screen has a destination written into it.
      if (result?.session) {
        saveSession(result.session)
        navigate(landingRouteFor(result.session), { replace: true })
        return
      }

      // As it stands the API answers with "Please confirm your email", and a
      // login before that is rejected with Auth.EmailNotConfirmed. So the flow
      // ends on an instruction to go and open the mail.
      setCreated(true)
    } catch (error) {
      setSubmitError(
        error.message || 'تعذر إنشاء الحساب، حاول مرة أخرى لاحقًا.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <SignUpLayout
      visualTitle="أنشئ حسابك الآن"
      visualDescription="أفضل المنصات للخدمات المنزلية. نوفر لك الجودة، السرعة، والضمان في مكان واحد مع أفضل الفنيين المتخصصين."
      visualImage={termsHero}
      visualCrop={TERMS_HERO_CROP}
    >
      <SignUpStepper currentStep={3} />

      {created ? (
        <AccountCreatedPanel email={details?.email} />
      ) : (
        <>
      <header className="flex flex-col gap-[8px] pt-[8px]">
        <h1 className="text-[29px] font-bold leading-[1.5] text-text-500">
          الشروط والاحكام
        </h1>
        <p className="text-[20px] leading-[1.5] text-accent-600">
          اقرا جيدا الشروط لضمان جوده الاستخدام والتجربه الجيده
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
      >
        <TermsList terms={CUSTOMER_TERMS} />
      </TermsConsent>
        </>
      )}
    </SignUpLayout>
  )
}

export default CustomerSignUpTerms
