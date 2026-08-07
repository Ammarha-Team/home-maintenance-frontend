import { Navigate, Route, Routes } from "react-router-dom";

import {
  AUTH_ROUTES,
  SIGN_UP_INFO_PATTERN,
} from "../modules/auth/constants/authRoutes.js";

import { EMERGENCY_ROUTES } from "../modules/emergency/constants/emergency";

import LandingPage from "../landing/pages/LandingPage";
import Home from "../modules/home/pages/Home";
import Services from "../modules/services/pages/Services";
import AccountRestricted from "../modules/account-restriction/pages/AccountRestricted";

import Login from "../modules/auth/pages/Login.jsx";
import ForgotPassword from "../modules/auth/pages/ForgotPassword.jsx";
import SignUpInfo from "../modules/auth/pages/SignUpInfo.jsx";
import CustomerSignUpTerms from "../modules/auth/pages/CustomerSignUpTerms.jsx";
import TechnicianSignUpTerms from "../modules/auth/pages/TechnicianSignUpTerms.jsx";

import EmergencyRequest from "../modules/emergency/pages/EmergencyRequest";
import EmergencyTracking from "../modules/emergency/pages/EmergencyTracking";
import EmergencyRating from "../modules/emergency/pages/EmergencyRating";

import Profile from "../modules/profile/pages/Profile";
import Settings from "../modules/profile/pages/Settings";
import ChangePassword from "../modules/profile/pages/ChangePassword";
import Notifications from "../modules/profile/pages/Notifications";
import Language from "../modules/profile/pages/Language";
import HelpSupport from "../modules/profile/pages/HelpSupport";
import PrivacyPolicy from "../modules/profile/pages/PrivacyPolicy";
import Terms from "../modules/profile/pages/Terms";
import About from "../modules/profile/pages/About";
import SavedAddresses from "../modules/profile/pages/SavedAddresses";

// My Orders & Technicians
import MyOrders from "../modules/orders/pages/MyOrders";
import OrderOffers from "../modules/orders/pages/OrderOffers";
import OrderTracking from "../modules/orders/pages/OrderTracking";
import TechnicianProfile from "../modules/technicians/pages/TechnicianProfile";
import { ORDERS_ROUTES } from "../modules/orders/constants/ordersRoutes";

// 👇 1. استدعاء مكون المحادثة/الشات من الموديول الخاص به
import Chat from "../modules/chat/pages/Chat"; // تأكد من مسار الملف لديك

// The admin console keeps its own route table and mounts here as one branch.
import AdminRoutes from "./AdminRoutes.jsx";

function AppRoutes() {
  return (
    <>
      {/* Route changes keep the old scroll position, which lands a screen
          reached from the bottom of a long page partway down its own. */}
      {/* <ScrollToTop /> */}

    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<Home />} />

      <Route path="/services" element={<Services />} />
      <Route path="/AccountRestricted" element={<AccountRestricted />}/>

      <Route path={AUTH_ROUTES.login} element={<Login />} />
      <Route path={AUTH_ROUTES.forgotPassword} element={<ForgotPassword />} />

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

      {/* Emergency */}
      <Route
        path={EMERGENCY_ROUTES.request}
        element={<EmergencyRequest />}
      />

      <Route
        path={EMERGENCY_ROUTES.requestAlias}
        element={<EmergencyRequest />}
      />

      <Route
        path={EMERGENCY_ROUTES.tracking}
        element={<EmergencyTracking />}
      />

      <Route
        path={EMERGENCY_ROUTES.rating}
        element={<EmergencyRating />}
      />

      {/* Profile */}
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

      {/* Admin console. It has to be registered before the catch-all below,
          which would otherwise answer every /admin path and redirect out. */}
      <Route path="/admin/*" element={<AdminRoutes />} />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  );
}

export default AppRoutes;