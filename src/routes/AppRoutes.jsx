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
import ConfirmEmail from "../modules/auth/pages/ConfirmEmail.jsx";
import ResetPassword from "../modules/auth/pages/ResetPassword.jsx";
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

// The technician portal.
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

// The admin console keeps its own route table and mounts here as one branch.
import AdminRoutes from "./AdminRoutes.jsx";

function AppRoutes() {
  return (
    <>
      {/* Route changes keep the old scroll position, which lands a screen
          reached from the bottom of a long page partway down its own. */}
      <ScrollToTop />

    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<Home />} />

      <Route path="/services" element={<Services />} />
      <Route path="/AccountRestricted" element={<AccountRestricted />}/>

      <Route path={AUTH_ROUTES.login} element={<Login />} />
      <Route path={AUTH_ROUTES.forgotPassword} element={<ForgotPassword />} />

      {/* Landing page for the confirmation mail. The mail carries userId and
          token on the query string and this screen spends them; without the
          route the link falls through to the catch-all below and the browser
          bounces to the landing page before the account is ever activated. */}
      <Route path={AUTH_ROUTES.confirmEmail} element={<ConfirmEmail />} />

      {/* Landing page for the reset mail, reachable only from that link. It
          has to exist here for the same reason: the API mails a link to its own
          POST endpoint otherwise, which a browser cannot open. */}
      <Route path={AUTH_ROUTES.resetPassword} element={<ResetPassword />} />

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

      {/* The customer's own orders. Every card in the list links to one of
          these three, and none of them was registered — the screens were built
          and imported but no path reached them. */}
      <Route path={ORDERS_ROUTES.myOrders} element={<MyOrders />} />
      <Route path={ORDERS_ROUTES.orderDetails} element={<OrderOffers />} />
      <Route path={ORDERS_ROUTES.orderOffers} element={<OrderOffers />} />
      <Route path={ORDERS_ROUTES.orderTracking} element={<OrderTracking />} />

      {/* Reached from an offer card, which links to the technician behind the
          offer rather than to the offer itself. */}
      <Route
        path="/my-orders/:id/technicians/:technicianId"
        element={<TechnicianProfile />}
      />

      <Route path="/chat" element={<Chat />} />

      {/* The technician portal. Named Technician* on both the route and the
          component so these can never be confused with the customer screens
          above.

          The first four are one flow: the dashboard leads to the job board,
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

      {/* عروضي — every offer the technician has sent, whatever became of it.
          It shares its screen with the public /services page above; only this
          path is behind the guard, so a signed-out visitor still reaches the
          public one and only a technician reaches their own offers. */}
      <Route
        path={TECHNICIAN_ROUTES.offers}
        element={
          <TechnicianRoute>
            <Services />
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