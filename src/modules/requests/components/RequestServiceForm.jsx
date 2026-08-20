import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

import ServiceSelector from "./ServiceSelector";
import ProblemDescription from "./ProblemDescription";
import UploadImages from "./UploadImages";
import ScheduleSection from "./ScheduleSection";
import HiringMethod from "./HiringMethod.jsx";
import SubmitRequest from "./SubmitRequest";

import { NEW_ADDRESS } from "./AddressSelector";
import { useServiceCategories } from "../hooks/useServiceCategories";
import { useMyAddresses } from "../hooks/useMyAddresses";
import {
  REQUEST_TYPE,
  createServiceRequest,
} from "../services/serviceRequestService";
import { reverseGeocodeParts } from "../../../shared/services/geocoding.js";
import { useToast } from "../../../shared/toast/toastContext.js";

// What a new address is called when the customer does not name it themselves —
// either because they left the save toggle off, or because they turned it on
// and then cleared the field.
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

  const {
    addresses,
    loading: addressesLoading,
    error: addressesError,
    reload: reloadAddresses,
  } = useMyAddresses();

  const [serviceCategoryId, setServiceCategoryId] = useState("");
  const [problemDescription, setProblemDescription] = useState("");
  const [images, setImages] = useState([]);
  const [schedule, setSchedule] = useState({ date: null, location: null });
  const [requestType, setRequestType] = useState(REQUEST_TYPE.public);

  // Opens on the map rather than on the address book.
  //
  // Starting on the saved side meant a customer with saved addresses landed on
  // a dropdown reading "choose a saved address" with nothing chosen and no map
  // under it — the one thing the screen is for was behind a menu. Nothing is
  // picked for them either way; this only decides which of the two ways in is
  // showing, and choosing a saved address still switches to it and puts the map
  // away.
  const [address, setAddress] = useState({
    mode: NEW_ADDRESS,
    savedId: "",
    save: false,
    title: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState(null);

  const updateSchedule = (patch) =>
    setSchedule((current) => ({ ...current, ...patch }));

  const updateAddress = (patch) =>
    setAddress((current) => ({ ...current, ...patch }));

  // An address book that failed to load, or has not loaded yet, is an address
  // book with nothing to pick from — the map is the way through in both cases.
  const usingSaved = address.mode !== NEW_ADDRESS && addresses.length > 0;

  // Everything the server would reject, said in Arabic before the round trip.
  const firstProblem = () => {
    if (!serviceCategoryId) return "اختر نوع الخدمة أولًا.";
    if (problemDescription.trim().length < MIN_DESCRIPTION_LENGTH) {
      return "اكتب وصفًا أوضح للمشكلة حتى يفهم الفني الحالة.";
    }
    if (!schedule.date) return "اختر التاريخ المناسب لزيارة الفني.";
    if (usingSaved && !address.savedId) return "اختر عنوان الخدمة أولًا.";
    if (!usingSaved && !schedule.location) {
      return "حدد موقع الخدمة على الخريطة.";
    }

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
      // A saved address travels as its id alone. Nothing else is sent and
      // nothing new is written, which is what stops the address book filling
      // up with a fresh row for every request to the same place.
      let addressFields = {
        addressId: address.savedId,
        saveAddress: false,
      };

      if (!usingSaved) {
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

        addressFields = {
          addressTitle: address.save
            ? address.title.trim() || ADDRESS_TITLE
            : ADDRESS_TITLE,
          addressLine:
            parts.line || `${schedule.location.lat}, ${schedule.location.lng}`,
          city: parts.city,
          country: parts.country,
          latitude: schedule.location.lat,
          longitude: schedule.location.lng,
          // True even when the customer left the toggle off, and the picker
          // says so under the checkbox rather than hiding it. A new address
          // sent with SaveAddress=false is accepted and then cannot be read
          // back — the detail endpoints answer 500 — so the request would be
          // created and immediately unopenable. Once the server handles an
          // unsaved address this becomes `address.save`.
          saveAddress: true,
        };
      }

      const id = await createServiceRequest(
        {
          serviceCategoryId,
          problemDescription: problemDescription.trim(),
          preferredDate: schedule.date,
          requestType,
          ...addressFields,
          images,
        },
        setProgress,
      );

      showToast({ message: "تم إرسال طلبك بنجاح. في انتظار عروض الفنيين." });

      // A public request's next step is the offers that come back to it, and
      // the create call answers with the id that screen needs.
      //
      // `onClose` is deliberately not called first. On the page it means "go
      // back", and a back navigation issued in the same tick wins the race —
      // the customer landed on the home screen instead of on their new
      // request. Leaving here unmounts the modal on its own.
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
      {/* Header — sticky, because in the modal the form scrolls inside a
          capped height and the title (and its close button) used to scroll
          out of reach. */}
      <div className="sticky top-0 z-10 flex items-center border-b border-gray-200 bg-white px-5 py-4 sm:px-6">
        <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
          طلب خدمة
        </h2>

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
      <div className="space-y-6 p-5 sm:p-6">
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

        <ScheduleSection
          value={schedule}
          onChange={updateSchedule}
          address={address}
          onAddressChange={updateAddress}
          addresses={addresses}
          addressesLoading={addressesLoading}
          addressesError={addressesError}
          onAddressesRetry={reloadAddresses}
        />

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
