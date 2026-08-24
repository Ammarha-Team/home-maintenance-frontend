import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import PublicLayout from '../../../shared/layouts/PublicLayout.jsx'
import Button from '../../../shared/components/Button.jsx'
import { AUTH_ROUTES } from '../../auth/constants/authRoutes.js'
import { signOut } from '../../auth/services/authService.js'
import { TECHNICIAN_ROUTES } from '../../technician/constants/technicianRoutes.js'
import UnderReviewPanel from '../components/UnderReviewPanel.jsx'
import { useSignedInTechnicianReview } from '../hooks/useTechnicianReview.js'

// TEMPORARY — DEMO ONLY. Part of the frontend-only technician review flow; see
// `../services/technicianReviewStore.js`.

/**
 * Where a signed-in technician waits out the review.
 *
 * The redirect is the whole reason this reads the store through a hook rather
 * than a one-off call: when an admin completes the review in another tab the
 * snapshot changes, this re-renders, and the technician is carried into the
 * portal without touching the page. Anyone who is not actually waiting — an
 * account that was approved, or one this browser has never seen — is sent to
 * the dashboard rather than being shown a screen that does not apply to them.
 */
function TechnicianUnderReview() {
  const navigate = useNavigate()
  const { email, isUnderReview } = useSignedInTechnicianReview()
  const [signingOut, setSigningOut] = useState(false)

  // The redirect does not wait on the request succeeding: `signOut` clears the
  // local session either way, and a technician who pressed sign out should not
  // be held on the screen by a server that is slow to answer.
  const handleSignOut = async () => {
    setSigningOut(true)
    await signOut()
    navigate(AUTH_ROUTES.login, { replace: true })
  }

  if (!isUnderReview) {
    return <Navigate to={TECHNICIAN_ROUTES.dashboard} replace />
  }

  return (
    <PublicLayout>
      <div dir="rtl" className="mx-auto max-w-[720px] px-[24px] pt-[32px] pb-[96px]">
        <UnderReviewPanel email={email}>
          <p className="text-[14px] leading-[1.6] text-text-300">
            ستصلك رسالة بعد اكتمال المراجعة. يمكنك إغلاق الصفحة والعودة لاحقًا.
          </p>

          <Button
            type="button"
            variant="secondary"
            fullWidth
            disabled={signingOut}
            onClick={handleSignOut}
            className="h-[52px] text-[16px]"
          >
            {signingOut ? '...جارٍ تسجيل الخروج' : 'تسجيل الخروج'}
          </Button>
        </UnderReviewPanel>
      </div>
    </PublicLayout>
  )
}

export default TechnicianUnderReview
