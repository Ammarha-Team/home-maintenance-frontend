import { MapPin, LocateFixed } from "lucide-react";

import ServiceMap from "../../../shared/components/ServiceMap";
import { useToast } from "../../../shared/toast/toastContext.js";

/**
 * The service-location picker for the request flow.
 *
 * Controlled: the surrounding form owns the position so the choice can be read
 * back alongside the chosen date. The map surface itself is the shared
 * `ServiceMap`; this adds the card, the "my location" shortcut and the readout.
 *
 * @param {{lat: number, lng: number}|null} value picked position, or null
 * @param {(next: {lat: number, lng: number}) => void} onChange
 */
export default function MapPicker({ value, onChange }) {
  const { showToast } = useToast();

  const getCurrentLocation = () => {
    // A refused or unavailable location is worth saying, not worth stopping the
    // form for — the map is still there to tap.
    const reportFailure = () =>
      showToast({ message: "لم نتمكن من تحديد موقعك", variant: "error" });

    if (!navigator.geolocation) {
      reportFailure();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (location) =>
        onChange({
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        }),
      reportFailure,
    );
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="relative">
        <ServiceMap
          value={value}
          onChange={onChange}
          className="h-[300px] w-full"
        />

        {/* Above Leaflet's own panes, which sit in the 400–700 z-index band. */}
        <button
          type="button"
          onClick={getCurrentLocation}
          className="absolute bottom-4 right-4 z-[1000] flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-gray-700 shadow-md transition hover:bg-gray-100"
        >
          <LocateFixed size={18} />
          موقعي الحالي
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2">
          <MapPin className="text-blue-600" />

          <p className="font-semibold text-gray-800">
            اختر موقع الخدمة من الخريطة
          </p>
        </div>

        <p className="mt-2 text-sm text-gray-500">
          {value
            ? `${value.lat.toFixed(5)} , ${value.lng.toFixed(5)}`
            : "اضغط على الخريطة لتحديد موقعك"}
        </p>
      </div>
    </div>
  );
}
