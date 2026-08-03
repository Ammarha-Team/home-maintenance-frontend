import SegmentedControl from '../../../shared/components/SegmentedControl.jsx'
import EnvelopeIcon from '../../../shared/components/icons/EnvelopeIcon.jsx'
import PhoneIcon from '../../../shared/components/icons/PhoneIcon.jsx'
import { AUTH_METHODS } from '../constants/authRoutes.js'

// Chooses whether the user signs in with a phone number or an email address
// (Figma node 6:1202). Phone is listed first so it lands on the right of the
// RTL control, matching the frame.
const METHOD_OPTIONS = [
  { id: AUTH_METHODS.phone, label: 'رقم التليفون', Icon: PhoneIcon },
  { id: AUTH_METHODS.email, label: 'الايميل الالكتروني', Icon: EnvelopeIcon },
]

function AuthMethodSwitcher({ value, onChange, className = '' }) {
  return (
    <SegmentedControl
      options={METHOD_OPTIONS}
      value={value}
      onChange={onChange}
      ariaLabel="طريقة تسجيل الدخول"
      className={className}
    />
  )
}

export default AuthMethodSwitcher
