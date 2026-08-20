import { useEffect, useRef, useState } from "react";
import { Loader2, MapPin, LocateFixed } from "lucide-react";

import ServiceMap from "../../../shared/components/ServiceMap";
import { reverseGeocodeParts } from "../../../shared/services/geocoding.js";
import { useToast } from "../../../shared/toast/toastContext.js";

// Long enough that dragging the pin around the map is one lookup rather than
// one per click. Nominatim asks anonymous callers to stay near a request a
// second, and a browser cannot identify itself with a User-Agent, so the
// restraint has to live here.
const LOOKUP_DEBOUNCE_MS = 500;

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

  // What the point is called, for the customer's benefit. The request still
  // travels as coordinates; this only says out loud where they land.
  const [address, setAddress] = useState(null);
  const [resolving, setResolving] = useState(false);
  const [lookupFailed, setLookupFailed] = useState(false);

  const lat = value?.lat ?? null;
  const lng = value?.lng ?? null;

  const requestRef = useRef(null);

  useEffect(() => {
    if (lat === null || lng === null) {
      setAddress(null);
      setLookupFailed(false);
      return undefined;
    }

    // The pin has moved, so whatever is on screen describes the old point.
    // Clearing it now is what stops the previous street sitting under the new
    // coordinates while the next answer is still in flight.
    setAddress(null);
    setLookupFailed(false);
    setResolving(true);

    const controller = new AbortController();
    requestRef.current?.abort();
    requestRef.current = controller;

    const timer = setTimeout(() => {
      // Deliberately the same call the submission makes, so what the customer
      // reads here is what the request will carry rather than a prettier
      // parallel lookup that could disagree with it.
      reverseGeocodeParts({ lat, lng }, { signal: controller.signal })
        .then((parts) => {
          if (controller.signal.aborted) return;

          // A point can resolve to nothing at all — open water, empty desert —
          // and that is an answer, not a failure.
          setAddress(parts ?? null);
          setLookupFailed(false);
        })
        .catch((error) => {
          if (error.name === "AbortError") return;
          setLookupFailed(true);
        })
        .finally(() => {
          if (!controller.signal.aborted) setResolving(false);
        });
    }, LOOKUP_DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [lat, lng]);

  useEffect(() => () => requestRef.current?.abort(), []);

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

  // Whichever parts came back, in the order they would be spoken. A place
  // missing any of them simply contributes fewer lines — nothing is filled in
  // on its behalf.
  const street = address?.line?.trim() ?? "";

  // Somewhere with no street of its own falls back to the whole display name,
  // which already ends in the city and the country. Printing those underneath
  // it again reads as a stutter — "الوادي الجديد, مصر" over "الوادي الجديد، مصر"
  // — so a part the line has already said is not repeated.
  const locality = [address?.city, address?.country]
    .filter(Boolean)
    .filter((part) => !street.includes(part))
    .join("، ");

  const addressLines = [street, locality].filter(Boolean);

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

      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center gap-2">
          {/* Sized like every other inline icon in the flow; left unsized it
              defaulted to 24 and stood larger than its own label. */}
          <MapPin
            size={18}
            aria-hidden="true"
            className="shrink-0 text-blue-600"
          />

          <p className="text-sm font-semibold text-gray-800">
            اختر موقع الخدمة من الخريطة
          </p>
        </div>

        <p className="mt-1.5 text-sm text-gray-500">
          {value
            ? `${value.lat.toFixed(5)} , ${value.lng.toFixed(5)}`
            : "اضغط على الخريطة لتحديد موقعك"}
        </p>

        {/* The same point in words, under the numbers that will actually be
            sent. `aria-live` because the pin is placed and the address arrives
            a moment later, which is otherwise a silent change. */}
        {value ? (
          <div className="mt-2 text-sm" aria-live="polite">
            {resolving ? (
              <p className="flex items-center gap-2 text-gray-500">
                <Loader2
                  size={14}
                  className="shrink-0 animate-spin"
                  aria-hidden="true"
                />
                جارٍ تحديد العنوان...
              </p>
            ) : addressLines.length > 0 ? (
              <div className="space-y-0.5">
                <p className="font-semibold text-gray-800">{addressLines[0]}</p>

                {addressLines[1] ? (
                  <p className="text-gray-500">{addressLines[1]}</p>
                ) : null}
              </div>
            ) : (
              // Both the failed lookup and the point that has no address read
              // the same way to the customer: the pin stands, we just cannot
              // name it. Saying the coordinates are kept is the part that
              // matters, because they are what the request is made of.
              <p className="text-gray-500">
                {lookupFailed
                  ? "تعذّر تحديد العنوان لهذا الموقع. الإحداثيات محفوظة."
                  : "لا يوجد عنوان معروف لهذه النقطة. الإحداثيات محفوظة."}
              </p>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
