import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import experienceIcon from '../../../assets/icons/experience.svg'
import specialisationIcon from '../../../assets/icons/specialisation.svg'
import userIcon from '../../../assets/icons/user.svg'
import Button from '../../../shared/components/Button.jsx'
import Input from '../../../shared/components/Input.jsx'
import Select from '../../../shared/components/Select.jsx'
import {
  MAX_EXPERIENCE_YEARS,
  validateConfirmPassword,
  validateEmail,
  validateExperience,
  validateFullName,
  validatePassword,
  validatePhone,
  validateSpecialisation,
} from '../../../shared/utils/validation.js'
import { AUTH_ROUTES } from '../constants/authRoutes.js'
import { passwordMeetsRules } from '../constants/passwordReset.js'
import { PROFESSION_LABELS_AR } from '../constants/technician.js'
import { getProfessions } from '../services/authService.js'
import EmailField from './EmailField.jsx'
import PasswordField from './PasswordField.jsx'
import PasswordRules from './PasswordRules.jsx'
import PhoneField from './PhoneField.jsx'

// Personal information form, step 2 of both sign up flows (Figma nodes 1:494
// customer / 1:686 technician). `role` is 'customer' or 'technician'; the
// technician frame adds the specialisation and years-of-experience fields.
// `nextRoute` is the terms step to advance to once the fields validate.
const EMPTY_VALUES = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  specialisation: '',
  experience: '',
}

// Both sign up frames draw the shared field at 56px (library default is 48px).
const FIELD_HEIGHT = 56
const FIELD_FONT_SIZE = 16
// Plain text inputs sit 8px below their label, the rest 10px (nodes 6:1377 /
// 6:1384 on the customer frame, 6:1572 / 6:1576 on the technician one).
const TEXT_LABEL_GAP = 8

function RegisterForm({ role, nextRoute }) {
  const navigate = useNavigate()
  const [values, setValues] = useState(EMPTY_VALUES)
  const [errors, setErrors] = useState({})
  const [professions, setProfessions] = useState([])

  const isTechnician = role === 'technician'

  // The trades come from the API, because what the register endpoint wants for
  // a technician is a profession id, not a label. The list is only needed on
  // the technician form, so the customer one never asks for it.
  //
  // The API returns English names; the app is Arabic, so each is shown through
  // PROFESSION_LABELS_AR and falls back to the server's own name for a trade
  // that has not been translated yet — better an English option than none.
  useEffect(() => {
    if (!isTechnician) return undefined

    let cancelled = false

    getProfessions()
      .then((list) => {
        if (cancelled) return

        setProfessions(
          list.map(({ id, name }) => ({
            value: id,
            label: PROFESSION_LABELS_AR[name] ?? name,
          })),
        )
      })
      .catch(() => {
        if (!cancelled) {
          setErrors((current) => ({
            ...current,
            specialisation: 'تعذر تحميل قائمة التخصصات، حاول تحديث الصفحة.',
          }))
        }
      })

    return () => {
      cancelled = true
    }
  }, [isTechnician])

  const setField = (name) => (value) => {
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const nextErrors = {
      fullName: validateFullName(values.fullName),
      email: validateEmail(values.email),
      phone: validatePhone(values.phone),
      // Judged against the same list shown under the field, so the checklist
      // and the submit check can never disagree.
      password:
        validatePassword(values.password) ||
        (passwordMeetsRules(values.password)
          ? ''
          : 'كلمة السر لا تحقق الشروط المطلوبة'),
      confirmPassword: validateConfirmPassword(
        values.confirmPassword,
        values.password,
      ),
      ...(isTechnician
        ? {
            specialisation: validateSpecialisation(values.specialisation),
            experience: validateExperience(values.experience),
          }
        : {}),
    }

    if (Object.values(nextErrors).some(Boolean)) {
      setErrors(nextErrors)
      return
    }

    setErrors({})

    // Customers never fill the trade fields, so they are dropped rather than
    // carried forward as empty strings.
    const details = isTechnician
      ? values
      : {
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
          password: values.password,
          confirmPassword: values.confirmPassword,
        }

    // The account is only created after the terms step, so the details are
    // handed forward rather than submitted here.
    navigate(nextRoute, { state: { role, details } })
  }

  const emailField = (
    <EmailField
      key="email"
      id={`${role}-email`}
      label="الايميل الالكتروني"
      placeholder="ادخل الايميل الالكتروني"
      height={FIELD_HEIGHT}
      fontSize={FIELD_FONT_SIZE}
      labelGap={TEXT_LABEL_GAP}
      value={values.email}
      onChange={setField('email')}
      error={errors.email}
    />
  )

  const phoneField = (
    <PhoneField
      key="phone"
      id={`${role}-phone`}
      label="رقم الهاتف"
      placeholder="234567899"
      height={FIELD_HEIGHT}
      fontSize={FIELD_FONT_SIZE}
      value={values.phone}
      onChange={setField('phone')}
      error={errors.phone}
    />
  )

  const identifierFields = isTechnician
    ? [phoneField, emailField]
    : [emailField, phoneField]

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-[32px]">
      {/* Re-keying on role replays the enter animation when the switch flips.
          The values live in this component, which stays mounted, so anything
          already typed into the shared fields survives the swap. */}
      <div key={role} className="signup-content-enter flex flex-col gap-[20px]">
        <Input
          id={`${role}-full-name`}
          label="الاسم بالكامل"
          placeholder="ادخل الاسم بالكامل"
          leadingIcon={userIcon}
          autoComplete="name"
          height={FIELD_HEIGHT}
          fontSize={FIELD_FONT_SIZE}
          labelGap={TEXT_LABEL_GAP}
          value={values.fullName}
          onChange={(event) => setField('fullName')(event.target.value)}
          error={errors.fullName}
        />

        {/* The frames order these differently: customer is email then phone
            (node 6:1345), technician is phone then email (node 6:1540). */}
        {identifierFields}

        <div className="flex flex-col gap-[16px]">
          <PasswordField
            id={`${role}-password`}
            label="كلمه السر"
            placeholder="********"
            autoComplete="new-password"
            height={FIELD_HEIGHT}
            fontSize={FIELD_FONT_SIZE}
            value={values.password}
            onChange={setField('password')}
            error={errors.password}
          />

          {/* The requirements sit under the field and tick themselves off as
              they are met, so the rules are visible while the password is being
              chosen rather than only after a rejected submit. */}
          <PasswordRules password={values.password} />

          <PasswordField
            id={`${role}-confirm-password`}
            label="تاكيد كلمه السر"
            placeholder="********"
            autoComplete="new-password"
            height={FIELD_HEIGHT}
            fontSize={FIELD_FONT_SIZE}
            value={values.confirmPassword}
            onChange={setField('confirmPassword')}
            error={errors.confirmPassword}
          />
        </div>

        {/* Trade and experience are only asked of technicians (node 1:716). */}
        {isTechnician ? (
          <>
            <Select
              id="technician-specialisation"
              label="التخصص"
              placeholder="اختر التخصص"
              leadingIcon={specialisationIcon}
              options={professions}
              height={FIELD_HEIGHT}
              fontSize={FIELD_FONT_SIZE}
              value={values.specialisation}
              onChange={(event) =>
                setField('specialisation')(event.target.value)
              }
              error={errors.specialisation}
            />

            <Input
              id="technician-experience"
              label="سنوات الخبره"
              type="number"
              inputMode="numeric"
              min={0}
              max={MAX_EXPERIENCE_YEARS}
              placeholder="4"
              leadingIcon={experienceIcon}
              height={FIELD_HEIGHT}
              fontSize={FIELD_FONT_SIZE}
              value={values.experience}
              onChange={(event) => setField('experience')(event.target.value)}
              error={errors.experience}
            />
          </>
        ) : null}
      </div>

      {/* The frame sizes this button full width at 20px, where the shared
          library default is 343px at 16px. */}
      <Button
        type="submit"
        fullWidth
        className="h-auto rounded-[16px] py-[16px] text-[20px] leading-[1.5] shadow-[0px_4px_7px_rgba(42,112,234,0.25)]"
      >
        التالي
      </Button>

      <p className="flex items-center justify-center gap-[4px] text-center">
        <span className="text-[24px] leading-[1.5] text-text-300">
          هل لديك حساب بالفعل؟
        </span>
        <Link
          to={AUTH_ROUTES.login}
          className="text-[20px] font-bold leading-[1.5] text-primary-500 underline"
        >
          تسجيل الدخول
        </Link>
      </p>
    </form>
  )
}

export default RegisterForm
