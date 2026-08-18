
import { Navigate, Route, Routes } from "react-router-dom";

import {
  AUTH_ROUTES,
  SIGN_UP_INFO_PATTERN,
} from "../modules/auth/constants/authRoutes.js";

import { EMERGENCY_ROUTES } from "../modules/emergency/constants/emergency";

import LandingPage from "../landing/pages/LandingPage";
import Home from "../modules/home/pages/Home";
import RequestService from "../modules/requests/pages/RequestService";
import Services from "../modules/services/pages/Services";
import AccountRestricted from "../modules/account-restriction/pages/AccountRestricted";
import TechnicianProfile from "../modules/technician-profile/pages/TechnicianProfile";

import Login from "../modules/auth/pages/Login.jsx";
import ForgotPassword from "../modules/auth/pages/ForgotPassword.jsx";
import ConfirmEmail from "../modules/auth/pages/ConfirmEmail.jsx";
import ResetPassword from "../modules/auth/pages/ResetPassword.jsx";
import SignUpInfo from "../modules/auth/pages/SignUpInfo.jsx";
import CustomerSignUpTerms from "../modules/auth/pages/CustomerSignUpTerms.jsx";
import TechnicianSignUpTerms from "../modules/auth/pages/TechnicianSignUpTerms.jsx";

import EmergencyRequest from "../modules/emergency/pages/EmergencyRequest";
import EmergencyTracking from "../modules/emergency/pages/EmergencyTracking";
import EmergencyRating from "../modules/emergency/pages/EmergencyRating";

import CustomerProfile from "../modules/profile/pages/Profile.jsx";
import Settings from "../modules/profile/pages/Settings";
import ChangePassword from "../modules/profile/pages/ChangePassword";
import Notifications from "../modules/profile/pages/Notifications";
import Language from "../modules/profile/pages/Language";
import HelpSupport from "../modules/profile/pages/HelpSupport";
import PrivacyPolicy from "../modules/profile/pages/PrivacyPolicy";
import Terms from "../modules/profile/pages/Terms";
import About from "../modules/profile/pages/About";
import SavedAddresses from "../modules/profile/pages/SavedAddresses";

import MyOrders from "../modules/orders/pages/MyOrders";
import OrderOffers from "../modules/orders/pages/OrderOffers";
import OrderTracking from "../modules/orders/pages/OrderTracking";
import TechnicianDetails from "../modules/technician-details/pages/TechnicianDetails";
import ReviewPage from "../modules/reviews/pages/ReviewPage";
import { ORDERS_ROUTES } from "../modules/orders/constants/ordersRoutes";

import Chat from "../modules/chat/pages/Chat";

import {
  TECHNICIAN_ROUTES,
} from "../modules/technician/constants/technicianRoutes.js";

import TechnicianDashboard from "../modules/technician/pages/TechnicianDashboard.jsx";
import TechnicianOrders from "../modules/technician/pages/TechnicianOrders.jsx";
import TechnicianOrderDetails from "../modules/technician/pages/TechnicianOrderDetails.jsx";
import TechnicianOrderOffer from "../modules/technician/pages/TechnicianOrderOffer.jsx";
import TechnicianOfferAccepted from "../modules/technician/pages/TechnicianOfferAccepted.jsx";
import TechnicianMessages from "../modules/technician/pages/TechnicianMessages.jsx";
import TechnicianJobTracking from "../modules/technician/pages/TechnicianJobTracking.jsx";
import TechnicianJobArrival from "../modules/technician/pages/TechnicianJobArrival.jsx";
import TechnicianJobCompletion from "../modules/technician/pages/TechnicianJobCompletion.jsx";
import TechnicianWallet from "../modules/technician/pages/TechnicianWallet.jsx";
import TechnicianPaymentDetails from "../modules/technician/pages/TechnicianPaymentDetails.jsx";
import TechnicianPaymentMethod from "../modules/technician/pages/TechnicianPaymentMethod.jsx";
import TechnicianPaymentConfirm from "../modules/technician/pages/TechnicianPaymentConfirm.jsx";
import TechnicianPaymentComplete from "../modules/technician/pages/TechnicianPaymentComplete.jsx";

import TechnicianRoute from "./TechnicianRoute.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import ScrollToTop from "./ScrollToTop.jsx";
import AdminRoutes from "./AdminRoutes.jsx";
import AdminRoute from "./AdminRoute.jsx";

function AppRoutes() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        {/* Landing & Home */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />

        {/* Request Service */}
        <Route
          path="/request-service"
          element={<RequestService />}
        />

        {/* Services */}
        <Route path="/services" element={<Services />} />

        <Route
          path="/AccountRestricted"
          element={<AccountRestricted />}
        />

        {/* Technician Profile */}
        <Route
          path="/technician/profile"
          element={
            <TechnicianRoute>
              <TechnicianProfile />
            </TechnicianRoute>
          }
        />

        {/* Authentication */}
        <Route
          path={AUTH_ROUTES.login}
          element={<Login />}
        />

        <Route
          path={AUTH_ROUTES.forgotPassword}
          element={<ForgotPassword />}
        />

        <Route
          path={AUTH_ROUTES.confirmEmail}
          element={<ConfirmEmail />}
        />

        <Route
          path={AUTH_ROUTES.resetPassword}
          element={<ResetPassword />}
        />

        <Route
          path="/register"
          element={
            <Navigate
              to={AUTH_ROUTES.customerSignUp}
              replace
            />
          }
        />

        <Route
          path={SIGN_UP_INFO_PATTERN}
          element={<SignUpInfo />}
        />

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
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <CustomerProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={<Settings />}
        />

        <Route
          path="/change-password"
          element={<ChangePassword />}
        />

        <Route
          path="/notifications"
          element={<Notifications />}
        />

        <Route
          path="/language"
          element={<Language />}
        />

        <Route
          path="/help-support"
          element={<HelpSupport />}
        />

        <Route
          path="/privacy-policy"
          element={<PrivacyPolicy />}
        />

        <Route
          path="/terms"
          element={<Terms />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/savedaddresses"
          element={<SavedAddresses />}
        />

        {/* Customer Orders */}
        <Route
          path={ORDERS_ROUTES.myOrders}
          element={<MyOrders />}
        />

        <Route
          path={ORDERS_ROUTES.orderDetails}
          element={<OrderOffers />}
        />

        <Route
          path={ORDERS_ROUTES.orderOffers}
          element={<OrderOffers />}
        />

        <Route
          path={ORDERS_ROUTES.orderTracking}
          element={<OrderTracking />}
        />

        {/* The technician as the customer sees them, on the way to accepting an
            offer. Not the technician's own profile screen — that one lives at
            /technician/profile and belongs to the technician portal. */}
        <Route
          path={ORDERS_ROUTES.technicianDetails}
          element={<TechnicianDetails />}
        />

        {/* Rating a finished job, reached from the completed order */}
        <Route
          path={ORDERS_ROUTES.orderReview}
          element={<ReviewPage />}
        />

        {/* Chat. Guarded because the conversation list, the messages and the
            hub connection are all read with the signed-in user's token — a
            visitor without one has nothing to be shown here. */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />

        {/* The customer menu pointed here long before the screen had a path.
            Kept as a redirect so older links land on the conversation rather
            than on the landing page. */}
        <Route
          path="/messages"
          element={<Navigate to="/chat" replace />}
        />

        {/* Technician Portal */}
        <Route
          path={TECHNICIAN_ROUTES.dashboard}
          element={
            <TechnicianRoute>
              <TechnicianDashboard />
            </TechnicianRoute>
          }
        />

        <Route
          path={TECHNICIAN_ROUTES.orders}
          element={
            <TechnicianRoute>
              <TechnicianOrders />
            </TechnicianRoute>
          }
        />

        <Route
          path={TECHNICIAN_ROUTES.orderDetails}
          element={
            <TechnicianRoute>
              <TechnicianOrderDetails />
            </TechnicianRoute>
          }
        />

        <Route
          path={TECHNICIAN_ROUTES.orderOffer}
          element={
            <TechnicianRoute>
              <TechnicianOrderOffer />
            </TechnicianRoute>
          }
        />

        <Route
          path={TECHNICIAN_ROUTES.offerAccepted}
          element={
            <TechnicianRoute>
              <TechnicianOfferAccepted />
            </TechnicianRoute>
          }
        />

        <Route
          path={TECHNICIAN_ROUTES.messages}
          element={
            <TechnicianRoute>
              <TechnicianMessages />
            </TechnicianRoute>
          }
        />

        <Route
          path={TECHNICIAN_ROUTES.jobTracking}
          element={
            <TechnicianRoute>
              <TechnicianJobTracking />
            </TechnicianRoute>
          }
        />

        <Route
          path={TECHNICIAN_ROUTES.jobArrival}
          element={
            <TechnicianRoute>
              <TechnicianJobArrival />
            </TechnicianRoute>
          }
        />

        <Route
          path={TECHNICIAN_ROUTES.jobCompletion}
          element={
            <TechnicianRoute>
              <TechnicianJobCompletion />
            </TechnicianRoute>
          }
        />

        {/* Technician Offers */}
        <Route
          path={TECHNICIAN_ROUTES.offers}
          element={
            <TechnicianRoute>
              <Services />
            </TechnicianRoute>
          }
        />

        {/* Technician Wallet & Payments */}
        <Route
          path={TECHNICIAN_ROUTES.wallet}
          element={
            <TechnicianRoute>
              <TechnicianWallet />
            </TechnicianRoute>
          }
        />

        <Route
          path={TECHNICIAN_ROUTES.paymentDetails}
          element={
            <TechnicianRoute>
              <TechnicianPaymentDetails />
            </TechnicianRoute>
          }
        />

        <Route
          path={TECHNICIAN_ROUTES.paymentMethod}
          element={
            <TechnicianRoute>
              <TechnicianPaymentMethod />
            </TechnicianRoute>
          }
        />

        <Route
          path={TECHNICIAN_ROUTES.paymentConfirm}
          element={
            <TechnicianRoute>
              <TechnicianPaymentConfirm />
            </TechnicianRoute>
          }
        />

        <Route
          path={TECHNICIAN_ROUTES.paymentComplete}
          element={
            <TechnicianRoute>
              <TechnicianPaymentComplete />
            </TechnicianRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <AdminRoutes />
            </AdminRoute>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </>
  );
}

export default AppRoutes;
