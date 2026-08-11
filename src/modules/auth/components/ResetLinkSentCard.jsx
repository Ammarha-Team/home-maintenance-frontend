import { Link } from 'react-router-dom'
import Button from '../../../shared/components/Button.jsx'
import EnvelopeIcon from '../../../shared/components/icons/EnvelopeIcon.jsx'
import ResetCard from './ResetCard.jsx'
import { AUTH_ROUTES } from '../constants/authRoutes.js'

/**
 * Step 2 while the reset is link-based: the request went through and the rest
 * of the flow is in the user's inbox.
 *
 * It reuses the same card shell as the other steps so the page does not change
 * shape underneath the user, and it repeats the address back so a typo is
 * visible here rather than discovered by a mail that never arrives.
 *
 * The address is shown in full rather than masked: the user typed it a moment
 * ago on this same page, so masking would hide the one detail worth checking.
 */
function ResetLinkSentCard({ email, onResend, resending, error }) {
  return (
    <ResetCard
      title="تحقق من بريدك الإلكتروني"
      subtitle="أرسلنا رابط إعادة تعيين كلمة المرور إلى بريدك"
    >
      <span
        aria-hidden="true"
        className="flex size-[72px] items-center justify-center rounded-full bg-primary-50 text-primary-500"
      >
        <EnvelopeIcon className="size-[30px]" />
      </span>

      <p className="w-full text-center text-[18px] leading-[1.5] font-bold break-all text-text-500">
        {email}
      </p>

      <p className="w-full text-center text-[16px] leading-[1.6] text-text-300">
        افتح بريدك واضغط على الرابط لإكمال إعادة تعيين كلمة المرور. إذا لم تجد
        الرسالة خلال دقائق، تحقق من مجلد الرسائل غير المرغوب فيها.
      </p>

      {error ? (
        <p
          role="alert"
          className="w-full text-center text-[14px] font-bold text-error-500"
        >
          {error}
        </p>
      ) : null}

      <div className="flex w-full flex-col gap-[12px]">
        <Button
          type="button"
          fullWidth
          variant="secondary"
          disabled={resending}
          onClick={onResend}
          className="h-[56px] text-[16px] sm:text-[18px]"
        >
          {resending ? '...جارٍ الإرسال' : 'إعادة إرسال الرابط'}
        </Button>

        <Link
          to={AUTH_ROUTES.login}
          className="flex h-[48px] w-full items-center justify-center rounded-[12px] text-[16px] font-bold text-primary-500 transition-colors hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        >
          العودة لتسجيل الدخول
        </Link>
      </div>
    </ResetCard>
  )
}

export default ResetLinkSentCard
