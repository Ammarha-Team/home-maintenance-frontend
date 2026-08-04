import { Navigate, Route, Routes } from "react-router-dom";
import {
  AUTH_ROUTES,
  SIGN_UP_INFO_PATTERN,
} from "../modules/auth/constants/authRoutes.js";

import Login from "../modules/auth/pages/Login.jsx";
import SignUpInfo from "../modules/auth/pages/SignUpInfo.jsx";
import CustomerSignUpTerms from "../modules/auth/pages/CustomerSignUpTerms.jsx";
import TechnicianSignUpTerms from "../modules/auth/pages/TechnicianSignUpTerms.jsx";

import LandingPage from "../landing/pages/LandingPage";
import Home from "../modules/home/pages/Home";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<Home />} />

      <Route path={AUTH_ROUTES.login} element={<Login />} />

      {/* The site header links here for "إنشاء حساب". Sign up is split by role
          and starts on the customer step, so /register is an entry point into
          that flow rather than a screen of its own. Without this the catch-all
          below sends the button back to the landing page. */}
      <Route
        path="/register"
        element={<Navigate to={AUTH_ROUTES.customerSignUp} replace />}
      />

      <Route path={SIGN_UP_INFO_PATTERN} element={<SignUpInfo />} />
      <Route
        path={AUTH_ROUTES.customerSignUpTerms}
        element={<CustomerSignUpTerms />}
      />
      <Route
        path={AUTH_ROUTES.technicianSignUpTerms}
        element={<TechnicianSignUpTerms />}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;