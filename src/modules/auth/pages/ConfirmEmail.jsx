import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import PublicLayout from '../../../shared/layouts/PublicLayout.jsx'
import { AUTH_ROUTES } from '../constants/authRoutes.js'
import { confirmEmail } from '../services/authService.js'

/**
 * Where the confirmation mail should land.
 *
 * The API's own confirm-email endpoint answers with raw JSON, which is not a
 * page to send a person to, and the link the backend currently mails points at
 * `https://localhost:7193` — its development address — so it fails with
 * ERR_CONNECTION_REFUSED on any machine that is not running the API locally.
 *
 * This screen gives that mail somewhere real to go: it takes the `userId` and
 * `token` from the query string, calls the endpoint itself, and reports the
 * outcome. The backend still has to build the link against the deployed
 * frontend for the flow to work from an inbox.
 */
function ConfirmEmail() {
  const [params] = useSearchParams()
  const [state, setState] = useState('checking')
  const [message, setMessage] = useState('')

  const userId = params.get('userId')
  const token = params.get('token')

  // StrictMode mounts effects twice in development and the token is single
  // use — a second call would report a failure for a confirmation that had
  // already succeeded.
  const requested = useRef(false)

  useEffect(() => {
    if (requested.current) return
    requested.current = true

    if (!userId || !token) {
      setState('error')
      setMessage('رابط التفعيل غير مكتمل. افتح الرابط من رسالة البريد كما هو.')
      return
    }

    confirmEmail({ userId, token })
      .then(() => setState('done'))
      .catch((error) => {
        setState('error')

        // A 4xx here is the token being refused: expired, or already spent by
        // an earlier click. Without a domain message the shared handler falls
        // back to "try again later", which a dead link will never satisfy —
        // so say what actually went wrong and where a new one comes from.
        const refused = error.status >= 400 && error.status < 500
        const unexplained = !error.code || error.code === 'Unknown'

        setMessage(
          refused && unexplained
            ? 'انتهت صلاحية رابط التفعيل أو تم استخدامه من قبل. سجّل الدخول لطلب رسالة تفعيل جديدة.'
            : error.message ||
                'تعذر تفعيل الحساب. قد يكون الرابط منتهي الصلاحية أو مستخدمًا من قبل.',
        )
      })
  }, [userId, token])

  return (
    <PublicLayout>
      <div
        dir="rtl"
        className="mx-auto flex w-full max-w-[560px] flex-col items-center gap-[20px] px-[24px] py-[64px] text-center"
      >
        {state === 'checking' ? (
          <p className="text-[20px] font-bold text-text-400">
            جارٍ تفعيل حسابك…
          </p>
        ) : null}

        {state === 'done' ? (
          <>
            <span
              aria-hidden="true"
              className="flex size-[72px] items-center justify-center rounded-full bg-success-100 text-success-800"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-[32px]"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            </span>

            <h1 className="text-[24px] font-bold text-text-500">
              تم تفعيل حسابك
            </h1>
            <p className="text-[16px] leading-[1.6] text-text-300">
              يمكنك الآن تسجيل الدخول باستخدام بريدك وكلمة المرور.
            </p>
          </>
        ) : null}

        {state === 'error' ? (
          <>
            <h1 className="text-[24px] font-bold text-text-500">
              تعذر تفعيل الحساب
            </h1>
            <p role="alert" className="text-[16px] leading-[1.6] text-error-500">
              {message}
            </p>
          </>
        ) : null}

        {state === 'checking' ? null : (
          <Link
            to={AUTH_ROUTES.login}
            className="flex h-[52px] w-full max-w-[320px] items-center justify-center rounded-[12px] bg-primary-500 text-[16px] font-bold text-white transition-colors hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
          >
            الذهاب لتسجيل الدخول
          </Link>
        )}
      </div>
    </PublicLayout>
  )
}

export default ConfirmEmail
