import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import hero from '../../../assets/auth/password-changed-hero.png'
import shieldCheck from '../../../assets/icons/shield-check.svg'
import { AUTH_ROUTES } from '../constants/authRoutes.js'

// "Password changed successfully" (Figma node 14:908). The frame draws it as a
// dialog over the reset page rather than as a page of its own, so it is built
// as one: the page stays mounted underneath, and both ways out — the close
// button and the call to action — land on login, which is the only place the
// flow can sensibly continue from.
function PasswordChangedDialog() {
  const navigate = useNavigate()
  const confirmRef = useRef(null)

  useEffect(() => {
    const goToLogin = () => navigate(AUTH_ROUTES.login, { replace: true })

    // The call to action is the point of the dialog, so it takes focus.
    confirmRef.current?.focus()

    const onKeyDown = (event) => {
      if (event.key === 'Escape') goToLogin()
    }

    // The page behind is long. Locking it stops the backdrop scrolling while
    // the dialog is up, and the original value is restored on the way out.
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = overflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [navigate])

  const goToLogin = () => navigate(AUTH_ROUTES.login, { replace: true })

  return (
    <div
      className="reset-backdrop-enter fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-[16px] sm:p-[24px]"
      onMouseDown={(event) => {
        // Only a press that starts on the backdrop dismisses, so a drag that
        // began inside the card does not close it on release.
        if (event.target === event.currentTarget) goToLogin()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="password-changed-title"
        aria-describedby="password-changed-body"
        dir="rtl"
        className="reset-modal-enter relative my-auto flex w-full max-w-[1192px] flex-col items-center gap-[24px] rounded-[12px] border border-line bg-white px-[20px] pt-[64px] pb-[32px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] sm:px-[32px] sm:pb-[48px]"
      >
        <button
          type="button"
          onClick={goToLogin}
          aria-label="إغلاق"
          className="absolute top-[19px] left-[20px] flex size-[38px] cursor-pointer items-center justify-center rounded-full bg-error-50 text-error-500 transition-colors hover:bg-error-500 hover:text-white sm:left-[32px]"
        >
          <svg
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
            focusable="false"
            className="size-[14px]"
          >
            <path d="M1 1l12 12M13 1L1 13" />
          </svg>
        </button>

        {/* The badge is placed against the illustration, not the card, so it
            keeps the frame's relationship to it at any width — and stays clear
            of the close button in the opposite corner. */}
        <div className="relative mx-auto w-fit max-w-full">
          <img
            src={hero}
            alt=""
            className="h-auto w-[220px] max-w-full object-contain sm:w-[300px] lg:w-[362px]"
          />

          <div className="absolute top-[16px] right-0 flex items-center gap-[8px] rounded-[12px] border border-line bg-white p-[12px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1)] sm:-right-[48px] sm:gap-[12px] sm:p-[17px] lg:-right-[96px]">
            <span className="flex flex-col items-end">
              <span className="text-[14px] font-bold leading-[1.5] text-text-400 sm:text-[16px]">
                حالة الأمان
              </span>
              <span className="text-[14px] leading-[1.5] text-text-300 sm:text-[16px]">
                محمي بالكامل
              </span>
            </span>

            <span className="flex size-[36px] shrink-0 items-center justify-center rounded-full bg-success-100 sm:size-[40px]">
              <img src={shieldCheck} alt="" className="h-[17px] w-[14px]" />
            </span>
          </div>
        </div>

        <div className="flex w-full max-w-[862px] flex-col items-center gap-[16px] text-center sm:gap-[24px]">
          <h1
            id="password-changed-title"
            className="text-[24px] font-bold leading-[1.5] text-success-600 sm:text-[29px]"
          >
            تم تغيير كلمة المرور بنجاح!
          </h1>

          <p
            id="password-changed-body"
            className="text-[16px] leading-[1.5] text-text-300 sm:text-[20px]"
          >
            لقد تم تحديث كلمة المرور الخاصة بك بنجاح. يمكنك الآن تسجيل الدخول
            باستخدام كلمة المرور الجديدة والبدء في إدارة أعمالك.
          </p>
        </div>

        <button
          ref={confirmRef}
          type="button"
          onClick={goToLogin}
          className="flex h-[56px] w-full max-w-[389px] cursor-pointer items-center justify-center rounded-[12px] bg-primary-500 px-[40px] text-[18px] font-bold text-primary-50 transition-colors hover:bg-primary-700 sm:text-[20px]"
        >
          الذهاب إلى تسجيل الدخول
        </button>
      </div>
    </div>
  )
}

export default PasswordChangedDialog
