import { useId, useState } from 'react'
import { Crosshair, MapPin } from 'lucide-react'

/**
 * Service location: either the device's current position or a typed address.
 *
 * Layout follows the Figma section (node 17:1697): a tinted panel holding the
 * map preview and the controls side by side, preview first in reading order so
 * it lands on the left of the RTL row. The design's fixed 360/625 split becomes
 * a fixed-basis preview beside a fluid column, and the row stacks under `sm` so
 * neither half is squeezed on a phone.
 *
 * The frame drew a map tile, but no map provider is configured in this project
 * and adding one is a dependency decision rather than a styling one. The
 * preview keeps the design's box — proportion, radius, border — and the
 * resolved position is stated in words below the controls, so swapping in a
 * real map touches only the markup inside that box.
 */
function LocationPicker({ value, onChange, error }) {
  const [locating, setLocating] = useState(false)
  const [geoError, setGeoError] = useState('')
  const fieldId = useId()
  const errorId = `${fieldId}-error`

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('المتصفح لا يدعم تحديد الموقع. أدخل العنوان يدوياً.')
      return
    }

    setLocating(true)
    setGeoError('')

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocating(false)
        onChange({
          mode: 'current',
          address: 'الموقع الحالي للجهاز',
          coords: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        })
      },
      () => {
        setLocating(false)
        setGeoError('تعذّر تحديد موقعك. أدخل العنوان يدوياً.')
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  const resolved =
    value.mode === 'current' && value.coords
      ? `${value.coords.lat.toFixed(4)}، ${value.coords.lng.toFixed(4)}`
      : value.address

  // The row splits at `lg`, not earlier: inside the dialog the panel is
  // narrower than the page, and at tablet width a side-by-side split left the
  // controls narrower than the preview — the reverse of the design's
  // proportion. Below that the two stack at full width.
  return (
    <div className="flex flex-col gap-[16px] rounded-[20px] border border-line bg-primary-50 p-[16px] md:rounded-[24px] md:p-[20px] lg:flex-row lg:items-start lg:gap-[24px] lg:p-[25px]">
      {/* Controls come first in the DOM: they are the interactive half, and in
          an RTL row the first child is the rightmost — which is where the frame
          puts them, leaving the preview on the left. */}
      <div className="flex min-w-0 flex-1 flex-col gap-[12px] md:gap-[16px]">
        <button
          type="button"
          disabled={locating}
          onClick={useCurrentLocation}
          className="flex min-h-[52px] w-full items-center justify-center gap-[8px] rounded-[16px] bg-primary-500 px-[16px] py-[14px] text-[15px] font-bold text-white transition-colors hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 disabled:cursor-not-allowed disabled:opacity-60 md:min-h-[56px] md:py-[16px] md:text-[16px]"
        >
          <Crosshair size={20} aria-hidden="true" className="shrink-0" />
          {locating ? 'جارٍ تحديد الموقع…' : 'استخدام الموقع الحالي'}
        </button>

        <div className="flex flex-col gap-[8px]">
          <label
            htmlFor={fieldId}
            className="text-right text-[15px] leading-[1.5] font-bold text-text-300 md:text-[16px]"
          >
            أدخل العنوان يدوياً
          </label>

          {/* Pin sits at the start of the field, the right-hand edge in RTL —
              the position the frame draws it in. */}
          <div
            className={`flex min-h-[52px] items-center gap-[12px] rounded-[16px] border bg-white px-[14px] md:min-h-[56px] md:px-[17px] ${
              error ? 'border-error-500' : 'border-accent-100'
            }`}
          >
            <MapPin
              size={22}
              aria-hidden="true"
              className="shrink-0 text-text-300"
            />
            <input
              id={fieldId}
              type="text"
              value={value.mode === 'manual' ? value.address : ''}
              onChange={(event) =>
                onChange({
                  mode: 'manual',
                  address: event.target.value,
                  coords: null,
                })
              }
              placeholder="شارع التخصصي، منطقة بوصلة"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
              className="h-full w-full bg-transparent py-[12px] text-right text-[16px] leading-[1.5] text-text-500 outline-none placeholder:text-text-300 md:text-[18px]"
            />
          </div>
        </div>

        <p className="text-right text-[13px] leading-[1.6] text-text-400">
          {resolved ? (
            <>
              <span className="font-bold text-text-500">الموقع المحدد: </span>
              {resolved}
            </>
          ) : (
            'حدّد موقعك ليصل الفني بأسرع وقت.'
          )}
        </p>

        {error ? (
          <p
            id={errorId}
            role="alert"
            className="text-right text-[12px] font-bold text-error-500"
          >
            {error}
          </p>
        ) : null}

        {geoError ? (
          <p
            role="alert"
            className="text-right text-[12px] font-bold text-error-500"
          >
            {geoError}
          </p>
        ) : null}
      </div>

      {/* Preview. Fixed basis from `sm` up so it holds the design's proportion
          beside the fluid column; full width when the row stacks. */}
      <div className="relative w-full shrink-0 overflow-hidden rounded-[16px] border border-accent-100 bg-white lg:w-[300px] xl:w-[360px]">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(0deg,var(--color-line)_1px,transparent_1px),linear-gradient(90deg,var(--color-line)_1px,transparent_1px)] bg-[size:26px_26px] opacity-70"
        />
        <div className="relative grid h-[150px] place-items-center sm:h-[172px] lg:h-[187px]">
          <MapPin size={30} aria-hidden="true" className="text-error-500" />
        </div>
      </div>
    </div>
  )
}

export default LocationPicker
