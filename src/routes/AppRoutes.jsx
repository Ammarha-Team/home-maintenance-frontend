import { Navigate, Route, Routes } from "react-router-dom";
import {
  AUTH_ROUTES,
  SIGN_UP_INFO_PATTERN,
} from "../modules/auth/constants/authRoutes.js";

import ForgotPassword from "../modules/auth/pages/ForgotPassword.jsx";
import Login from "../modules/auth/pages/Login.jsx";
import SignUpInfo from "../modules/auth/pages/SignUpInfo.jsx";
import CustomerSignUpTerms from "../modules/auth/pages/CustomerSignUpTerms.jsx";
import TechnicianSignUpTerms from "../modules/auth/pages/TechnicianSignUpTerms.jsx";

import LandingPage from "../landing/pages/LandingPage";
import Home from "../modules/home/pages/Home";

import Profile from "../modules/profile/pages/Profile";
import Settings from "../modules/profile/pages/Settings";

import ChangePassword from "../modules/profile/pages/ChangePassword";
import Notifications from "../modules/profile/pages/Notifications";
import Language from "../modules/profile/pages/Language";
import HelpSupport from "../modules/profile/pages/HelpSupport.jsx";
import PrivacyPolicy from "../modules/profile/pages/PrivacyPolicy";
import Terms from "../modules/profile/pages/Terms";
import About from "../modules/profile/pages/About";
import SavedAddresses from "../modules/profile/pages/SavedAddresses.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<Home />} />
      

      <Route path={AUTH_ROUTES.login} element={<Login />} />
      <Route path={AUTH_ROUTES.forgotPassword} element={<ForgotPassword />} />

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

      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />

      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/language" element={<Language />} />
      <Route path="/help-support" element={<HelpSupport />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/about" element={<About />} />
      <Route path="/savedaddresses" element={<SavedAddresses />} />

      
    </Routes>
  );
}

export default AppRoutes;