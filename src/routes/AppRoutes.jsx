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