import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

import ServiceSelector from "./ServiceSelector";
import ProblemDescription from "./ProblemDescription";
import UploadImages from "./UploadImages";
import ScheduleSection from "./ScheduleSection";
import HiringMethod from "./HiringMethod.jsx";
import SubmitRequest from "./SubmitRequest";

import { useServiceCategories } from "../hooks/useServiceCategories";
import {
  REQUEST_TYPE,
  createServiceRequest,
} from "../services/serviceRequestService";
import { reverseGeocodeParts } from "../../../shared/services/geocoding.js";
import { useToast } from "../../../shared/toast/toastContext.js";

// The API stores the picked point as an address and wants a name for it. The
// form has no field for one — the design asks for a pin, not an address book
// entry — so every request saved from here carries the same neutral title.
const ADDRESS_TITLE = "موقع الخدمة";

// Enough to tell a technician what they are bidding on. Below this the request
// is a guess, and the offers that come back are guesses too.
const MIN_DESCRIPTION_LENGTH = 10;

/**
 * A service request, from the heading down to the submit button.
 *
 * The page at /request-service and the modal on the home screen show the same
 * request; only the frame around it differs. Keeping the fields and the submit
 * here means the two cannot drift apart again — they did once, and the modal
 * lost the schedule and hiring sections in the process.
 *
 * @param {() => void} onClose closes the surrounding frame; the X is drawn only
 *   when a caller passes one
 */
export default function RequestServiceForm({ onClose }) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useServiceCategories();

  const [serviceCategoryId, setServiceCategoryId] = useState("");
  const [problemDescription, setProblemDescription] = useState("");
  const [images, setImages] = useState([]);
  const [schedule, setSchedule] = useState({ date: null, location: null });
  const [requestType, setRequestType] = useState(REQUEST_TYPE.public);

  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState(null);

  const updateSchedule = (patch) =>
    setSchedule((current) => ({ ...current, ...patch }));

  // Everything the server would reject, said in Arabic before the round trip.
  const firstProblem = () => {
    if (!serviceCategoryId) return "اختر نوع الخدمة أولًا.";
    if (problemDescription.trim().length < MIN_DESCRIPTION_LENGTH) {
      return "اكتب وصفًا أوضح للمشكلة حتى يفهم الفني الحالة.";
    }
    if (!schedule.date) return "اختر التاريخ المناسب لزيارة الفني.";
    if (!schedule.location) return "حدد موقع الخدمة على الخريطة.";

    return null;
  };

  const submit = async () => {
    const problem = firstProblem();
    if (problem) {
      setError(problem);
      return;
    }

    setSubmitting(true);
    setProgress(null);
    setError(null);

    try {
      // The map hands over a point and the API wants a line, a city and a
      // country, so the pin is turned back into an address here. A point with
      // no city — open water, empty desert — cannot be sent, and saying so is
      // better than inventing one.
      const parts = await reverseGeocodeParts(schedule.location);

      if (!parts?.city) {
        setError(
          "تعذر تحديد تفاصيل العنوان لهذا الموقع. اختر نقطة أقرب إلى عنوان معروف.",
        );
        return;
      }

      const id = await createServiceRequest(
        {
          serviceCategoryId,
          problemDescription: problemDescription.trim(),
          preferredDate: schedule.date,
          requestType,
          addressTitle: ADDRESS_TITLE,
          addressLine:
            parts.line || `${schedule.location.lat}, ${schedule.location.lng}`,
          city: parts.city,
          country: parts.country,
          latitude: schedule.location.lat,
          longitude: schedule.location.lng,
          images,
        },
        setProgress,
      );

      showToast({ message: "تم إرسال طلبك بنجاح. في انتظار عروض الفنيين." });

      // The request is created and the customer is done here, so the modal —
      // if this is one — closes before the move.
      onClose?.();

      // A public request's next step is the offers that come back to it, and
      // the create call answers with the id that screen needs.
      navigate(`/my-orders/${id}/offers`);
    } catch (failure) {
      setError(failure.message);
    } finally {
      setSubmitting(false);
      setProgress(null);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center border-b border-gray-200 px-6 py-4">
        <h2 className="text-2xl font-bold text-gray-800">طلب خدمة</h2>

        {/* `mr-auto` rather than `ml-auto`: the page is right to left, so the
            automatic margin has to grow on the right to push the button left. */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="mr-auto flex h-9 w-9 items-center justify-center rounded-full bg-red-100 text-red-600 transition hover:bg-red-200"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Body */}
      <div className="space-y-6 p-6">
        <ServiceSelector
          value={serviceCategoryId}
          onChange={setServiceCategoryId}
          categories={categories}
          loading={categoriesLoading}
          error={categoriesError}
        />

        <ProblemDescription
          value={problemDescription}
          onChange={setProblemDescription}
        />

        <UploadImages value={images} onChange={setImages} />

        <ScheduleSection value={schedule} onChange={updateSchedule} />

        <HiringMethod value={requestType} onChange={setRequestType} />

        <SubmitRequest
          onSubmit={submit}
          submitting={submitting}
          progress={progress}
          error={error}
        />
      </div>
    </>
  );
}
