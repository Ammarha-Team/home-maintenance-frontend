import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import {
  AUTH_ROUTES,
  SIGN_UP_INFO_PATTERN,
} from '../modules/auth/constants/authRoutes.js'
import Login from '../modules/auth/pages/Login.jsx'
import SignUpInfo from '../modules/auth/pages/SignUpInfo.jsx'
import CustomerSignUpTerms from '../modules/auth/pages/CustomerSignUpTerms.jsx'
import TechnicianSignUpTerms from '../modules/auth/pages/TechnicianSignUpTerms.jsx'

// Only the auth flow is wired for now. Landing, customer, technician and admin
// routes get added as those modules are built.
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={AUTH_ROUTES.login} element={<Login />} />
        {/* One element for both roles, so switching keeps it mounted. */}
        <Route path={SIGN_UP_INFO_PATTERN} element={<SignUpInfo />} />
        <Route
          path={AUTH_ROUTES.customerSignUpTerms}
          element={<CustomerSignUpTerms />}
        />
        <Route
          path={AUTH_ROUTES.technicianSignUpTerms}
          element={<TechnicianSignUpTerms />}
        />
        <Route path="*" element={<Navigate to={AUTH_ROUTES.login} replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
