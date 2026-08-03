import { Navigate, useNavigate, useParams } from 'react-router-dom'
import customerHero from '../../../assets/auth/signup-hero.png'
import technicianHero from '../../../assets/auth/technician-signup-hero.png'
import RegisterForm from '../components/RegisterForm.jsx'
import RoleSwitcher from '../components/RoleSwitcher.jsx'
import SignUpLayout from '../components/SignUpLayout.jsx'
import SignUpStepper from '../components/SignUpStepper.jsx'
import {
  AUTH_ROUTES,
  SIGN_UP_ROLES,
  signUpPathFor,
} from '../constants/authRoutes.js'

// Sign up step 2 of 3 for both roles — Figma nodes 1:456 (customer) and
// 1:648 (technician). One component serves both so switching role only swaps
// the parts that differ instead of tearing the page down.
// Hero crops are the frames' own image rects over the 519px panel — customer
// node 6:1338 (881 wide at x=-181), technician uses technician-signup-hero.png
// which is already sized to portrait format for the panel (width 1, offset 0).
const ROLE_CONTENT = {
  customer: {
    hero: customerHero,
    heroCrop: { width: 881 / 519, offsetX: -181 / 519 },
    termsRoute: AUTH_ROUTES.customerSignUpTerms,
  },
  technician: {
    hero: technicianHero,
    heroCrop: { width: 1, offsetX: 0 },
    termsRoute: AUTH_ROUTES.technicianSignUpTerms,
  },
}

function SignUpInfo() {
  const { role } = useParams()
  const navigate = useNavigate()

  if (!SIGN_UP_ROLES.includes(role)) {
    return <Navigate to={AUTH_ROUTES.customerSignUp} replace />
  }

  const content = ROLE_CONTENT[role]

  // Still a navigation so the URL stays shareable, but both roles resolve to
  // this same element, so React keeps it mounted and the swap animates.
  const handleRoleChange = (nextRole) => {
    if (nextRole !== role) navigate(signUpPathFor(nextRole))
  }

  return (
    <SignUpLayout
      visualTitle="أنشئ حسابك الآن"
      visualDescription="أفضل المنصات للخدمات المنزلية. نوفر لك الجودة، السرعة، والضمان في مكان واحد مع أفضل الفنيين المتخصصين."
      visualImage={content.hero}
      visualCrop={content.heroCrop}
    >
      <SignUpStepper currentStep={2} />

      <header className="flex flex-col gap-[8px] pt-[8px]">
        <h1 className="text-[29px] font-bold leading-[1.5] text-text-500">
          مرحباً بك
        </h1>
        <p className="text-[20px] leading-[1.5] text-accent-600">
          اختر نوع الحساب للمتابعة
        </p>
      </header>

      <RoleSwitcher value={role} onChange={handleRoleChange} />

      <RegisterForm role={role} nextRoute={content.termsRoute} />
    </SignUpLayout>
  )
}

export default SignUpInfo
