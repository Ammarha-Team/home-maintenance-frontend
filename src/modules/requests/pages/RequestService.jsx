import { useNavigate } from "react-router-dom";

import RequestServiceForm from "../components/RequestServiceForm";

export default function RequestService() {
  const navigate = useNavigate();

  // Closing means going back where the request was started from. Opened
  // directly — a pasted link, a new tab — there is nothing to go back to
  // inside the app, so the home screen stands in.
  const close = () =>
    window.history.length > 1 ? navigate(-1) : navigate("/home");

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8" dir="rtl">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <RequestServiceForm onClose={close} />
      </div>
    </div>
  );
}
