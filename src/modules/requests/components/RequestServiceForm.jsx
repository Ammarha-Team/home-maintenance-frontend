import { useState } from "react";
import { X } from "lucide-react";

import ServiceSelector from "./ServiceSelector";
import ProblemDescription from "./ProblemDescription";
import UploadImages from "./UploadImages";
import ScheduleSection from "./ScheduleSection";
import HiringMethod from "./HiringMethod.jsx";
import SubmitRequest from "./SubmitRequest";

/**
 * A service request, from the heading down to the submit button.
 *
 * The page at /request-service and the modal on the home screen show the same
 * request; only the frame around it differs. Keeping the sections and the
 * schedule state here means the two cannot drift apart again — they did once,
 * and the modal lost the schedule and hiring sections in the process.
 *
 * @param {() => void} onClose closes the surrounding frame; the X is drawn only
 *   when a caller passes one
 */
export default function RequestServiceForm({ onClose }) {
  const [schedule, setSchedule] = useState({ date: null, location: null });

  const updateSchedule = (patch) =>
    setSchedule((current) => ({ ...current, ...patch }));

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
        <ServiceSelector />
        <ProblemDescription />
        <UploadImages />
        <ScheduleSection value={schedule} onChange={updateSchedule} />
        <HiringMethod />
        <SubmitRequest />
      </div>
    </>
  );
}
