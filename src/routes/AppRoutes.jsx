import { Navigate, Route, Routes } from "react-router-dom";
import {
  AUTH_ROUTES,
  SIGN_UP_INFO_PATTERN,
} from "../modules/auth/constants/authRoutes.js";

import ConfirmEmail from "../modules/auth/pages/ConfirmEmail.jsx";
import ForgotPassword from "../modules/auth/pages/ForgotPassword.jsx";
import ResetPassword from "../modules/auth/pages/ResetPassword.jsx";
import Login from "../modules/auth/pages/Login.jsx";
import SignUpInfo from "../modules/auth/pages/SignUpInfo.jsx";
import CustomerSignUpTerms from "../modules/auth/pages/CustomerSignUpTerms.jsx";
import TechnicianSignUpTerms from "../modules/auth/pages/TechnicianSignUpTerms.jsx";

import LandingPage from "../landing/pages/LandingPage";
import Home from "../modules/home/pages/Home";

import { EMERGENCY_ROUTES } from "../modules/emergency/constants/emergency.js";
import EmergencyRequest from "../modules/emergency/pages/EmergencyRequest.jsx";
import EmergencyTracking from "../modules/emergency/pages/EmergencyTracking.jsx";
import EmergencyRating from "../modules/emergency/pages/EmergencyRating.jsx";

import { TECHNICIAN_ROUTES } from "../modules/technician/constants/technicianRoutes.js";
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
import ScrollToTop from "./ScrollToTop.jsx";

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

import ReviewPage from "../modules/reviews/pages/ReviewPage";
import Services from "../modules/services/pages/Services";

function AppRoutes() {
  return (
    <>
      {/* Route changes keep the old scroll position, which lands a screen
          reached from the bottom of a long page partway down its own. */}
      <ScrollToTop />

    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<Home />} />
      <Route path="/review" element={<ReviewPage />} />
      {/* The footer's "الخدمات" points here, but the screen behind it lists the
          technician's own sent offers — so it moved under /technician, behind
          the portal guard, and this path follows it. A customer who lands here
          is sent to their own home by that guard rather than being shown
          another account's offers.

          A customer-facing services listing still has to be built; when it is,
          it takes this path back. */}
    <Route
  path="/services"
  element={<Services />}
/>
      

      <Route path={AUTH_ROUTES.login} element={<Login />} />
      <Route path={AUTH_ROUTES.forgotPassword} element={<ForgotPassword />} />

      {/* Landing page for the confirmation mail. The backend has to point the
          link here instead of at its own dev address for it to be reachable
          from an inbox. */}
      <Route path={AUTH_ROUTES.confirmEmail} element={<ConfirmEmail />} />

      {/* Landing page for the reset mail. The link must point here rather than
          at the API's POST endpoint, which a browser cannot open. */}
      <Route path={AUTH_ROUTES.resetPassword} element={<ResetPassword />} />

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

      {/* Emergency service. The home screen's quick actions already point at
          /emergency-diagnosis, so that path is kept as an alias rather than
          changing a link this feature does not own. */}
      <Route path={EMERGENCY_ROUTES.request} element={<EmergencyRequest />} />
      <Route
        path={EMERGENCY_ROUTES.requestAlias}
        element={<EmergencyRequest />}
      />
      <Route
        path={EMERGENCY_ROUTES.tracking}
        element={<EmergencyTracking />}
      />
      <Route path={EMERGENCY_ROUTES.rating} element={<EmergencyRating />} />

      {/* Technician portal. Kept under its own /technician prefix so it can
          never be confused with the customer screens above.

          The four screens are one flow: the dashboard leads to the job board,
          the board opens a request, and the request leads to the offer that
          bids for it. Every one of them sits behind the same guard — a
          customer who reaches these paths has nothing to do here. */}
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

      {/* The job, once the offer wins it. Sending an offer lands on the
          acceptance screen, which starts the job; from there the technician
          confirms arrival and then closes the service out. Messaging is a
          detour off the acceptance screen rather than a step in that chain,
          which is why it keeps a path of its own. */}
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

      {/* عروضي — every offer the technician has sent, filtered by what became
          of it. Behind the same guard as the rest of the portal. */}
      <Route
        path={TECHNICIAN_ROUTES.offers}
        element={
          <TechnicianRoute>
            <Services />
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

      {/* The wallet, and the settlement that runs out of it. The technician
          owes the platform its commission, so this flow goes the other way from
          the job screens above: the wallet states what is due, the payment
          screens collect it, and the receipt closes it out. Each screen leads
          to the next, and the wallet is the only way in. */}
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
    </>
  );
}

export default AppRoutes;