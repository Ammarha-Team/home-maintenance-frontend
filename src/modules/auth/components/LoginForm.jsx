import { useState } from 'react'
import { Link } from 'react-router-dom'
import iconApple from '../../../assets/auth/icon-apple.svg'
import iconFacebook from '../../../assets/auth/icon-facebook.svg'
import iconGoogle from '../../../assets/auth/icon-google.svg'
import { AUTH_METHODS, AUTH_ROUTES } from '../constants/authRoutes.js'
import { login } from '../services/authService.js'
import {
  validateEmail,
  validatePassword,
  validatePhone,
} from '../../../shared/utils/validation.js'
import Button from '../../../shared/components/Button.jsx'
import Checkbox from '../../../shared/components/Checkbox.jsx'
import AuthMethodSwitcher from './AuthMethodSwitcher.jsx'
import EmailField from './EmailField.jsx'
import PasswordField from './PasswordField.jsx'
import PhoneField from './PhoneField.jsx'

const SOCIAL_PROVIDERS = [
  { id: 'apple', label: 'Apple', icon: iconApple },
  { id: 'facebook', label: 'Facebook', icon: iconFacebook },
  { id: 'google', label: 'Google', icon: iconGoogle },
]

// The login frame draws the shared field at 56px / 16px (nodes 6:1216, 6:1228).
const FIELD_HEIGHT = 56
const FIELD_FONT_SIZE = 16

// Login form from Figma nodes 6:1196 (phone) and 6:1280 (email) — one form, the
// identifier swaps with the segmented control above it.
function LoginForm() {
  const [method, setMethod] = useState(AUTH_METHODS.phone)
  const [values, setValues] = useState({ phone: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [rememberMe, setRememberMe] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const isEmail = method === AUTH_METHODS.email

  const setField = (name) => (value) => {
    setValues((current) => ({ ...current, [name]: value }))
    // Clear the error as soon as the user starts correcting the field.
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  const handleMethodChange = (nextMethod) => {
    setMethod(nextMethod)
    setErrors({})
    setSubmitError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    // Only the active identifier is validated, so a half-typed phone number
    // never blocks a login by email, and vice versa.
    const identifierError = isEmail
      ? validateEmail(values.email)
      : validatePhone(values.phone)
    const passwordError = validatePassword(values.password)

    if (identifierError || passwordError) {
      setErrors({
        [isEmail ? 'email' : 'phone']: identifierError,
        password: passwordError,
      })
      return
    }

    setErrors({})
    setSubmitError('')
    setSubmitting(true)

    try {
      await login({
        method,
        identifier: isEmail ? values.email : values.phone,
        password: values.password,
        rememberMe,
      })
    } catch {
      // authService is still a stub — surface it instead of faking success.
      setSubmitError('تعذر تسجيل الدخول، حاول مرة أخرى لاحقًا.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-[calc(var(--auth-unit)*9)]"
    >
      <div className="flex flex-col gap-[calc(var(--auth-unit)*4)]">
        <AuthMethodSwitcher value={method} onChange={handleMethodChange} />

        <div className="flex flex-col gap-[calc(var(--auth-unit)*2.5)]">
          {/* Re-keying replays the enter animation when the identifier swaps,
              matching the role switch on the sign up screens. */}
          <div key={method} className="signup-content-enter">
            {isEmail ? (
              <EmailField
                id="login-email"
                label="الايميل الالكتروني"
                placeholder="ادخل الايميل الالكتروني"
                height={FIELD_HEIGHT}
                fontSize={FIELD_FONT_SIZE}
                value={values.email}
                onChange={setField('email')}
                error={errors.email}
              />
            ) : (
              <PhoneField
                id="login-phone"
                label="رقم الهاتف"
                placeholder="234567899"
                height={FIELD_HEIGHT}
                fontSize={FIELD_FONT_SIZE}
                value={values.phone}
                onChange={setField('phone')}
                error={errors.phone}
              />
            )}
          </div>

          <div className="flex flex-col gap-[calc(var(--auth-unit)*2)]">
            <PasswordField
              id="login-password"
              label="كلمه السر"
              placeholder="********"
              autoComplete="current-password"
              height={FIELD_HEIGHT}
              fontSize={FIELD_FONT_SIZE}
              value={values.password}
              onChange={setField('password')}
              error={errors.password}
            />

            <div className="flex flex-wrap items-center justify-between gap-x-[16px] gap-y-[8px]">
              <Checkbox
                id="login-remember"
                label="تذكرني دائما"
                checked={rememberMe}
                onChange={setRememberMe}
              />

              <Link
                to={AUTH_ROUTES.forgotPassword}
                className="text-[16px] leading-[1.5] text-primary-300 underline sm:text-[20px]"
              >
                هل نسيت كلمه المرور؟
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-[calc(var(--auth-unit)*13)]">
        <div className="flex flex-col items-center gap-[calc(var(--auth-unit)*8.25)]">
          <div className="flex w-full flex-col gap-[calc(var(--auth-unit)*2)]">
            {submitError ? (
              <p role="alert" className="text-right text-[16px] text-red-600">
                {submitError}
              </p>
            ) : null}

            {/* The login frame (1:381) sizes this button full width at 20px,
                where the shared library default is 343px at 16px. */}
            <Button
              type="submit"
              fullWidth
              disabled={submitting}
              className="h-auto rounded-[16px] py-[14px] text-[18px] leading-[1.5] shadow-[0px_4px_7px_rgba(42,112,234,0.25)] sm:py-[16px] sm:text-[20px]"
            >
              {submitting ? '...جارٍ تسجيل الدخول' : 'تسجيل دخول'}
            </Button>
          </div>

          <div className="flex w-full flex-col items-center gap-[calc(var(--auth-unit)*5.625)]">
            <div className="relative w-[493px] max-w-full">
              <span className="block h-px w-full bg-accent-100" />
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface px-[10px] py-[8px] text-[16px] leading-[1.5] text-text-secondary">
                او عن طريق
              </span>
            </div>

            <div dir="ltr" className="flex items-center gap-[24px] sm:gap-[36px]">
              {SOCIAL_PROVIDERS.map((provider) => (
                <button
                  key={provider.id}
                  type="button"
                  aria-label={`المتابعة عبر ${provider.label}`}
                  className="cursor-pointer transition-opacity hover:opacity-80"
                >
                  <img
                    src={provider.icon}
                    alt=""
                    className="size-[38px] sm:size-[45px]"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="flex flex-wrap items-center justify-center gap-[4px] text-center">
          <span className="text-[18px] leading-[1.5] text-text-300 sm:text-[24px]">
            ليس لديك حساب؟
          </span>
          <Link
            to={AUTH_ROUTES.customerSignUp}
            className="text-[16px] font-bold leading-[1.5] text-primary-500 underline sm:text-[20px]"
          >
            إنشاء حساب جديد
          </Link>
        </p>
      </div>
    </form>
  )
}

export default LoginForm
