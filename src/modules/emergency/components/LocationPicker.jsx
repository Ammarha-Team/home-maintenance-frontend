import { useState } from 'react'
import { Crosshair, MapPin } from 'lucide-react'
import Button from '../../../shared/components/Button.jsx'
import Input from '../../../shared/components/Input.jsx'

/**
 * Service location: either the device's current position or a typed address.
 *
 * The frame drew a map thumbnail, but no map provider is configured in this
 * project and adding one is a dependency decision rather than a styling one.
 * The preview below is therefore a drawn placeholder that states the resolved
 * position in words — the information the user actually needs to confirm —
 * and is isolated here so swapping in a real map touches only this file.
 */
function LocationPicker({ value, onChange, error }) {
  const [locating, setLocating] = useState(false)
  const [geoError, setGeoError] = useState('')

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

  return (
    <div className="flex flex-col gap-[14px] rounded-[14px] bg-primary-50 p-[14px] md:p-[18px]">
      {/* Preview sits under the controls on a phone and beside them from md
          up, so the confirmation lands close to the thumb that picked it. */}
      <div className="flex flex-col gap-[14px] md:flex-row-reverse md:items-start">
        <div className="flex flex-1 flex-col gap-[12px]">
          <Button
            type="button"
            variant="primary"
            size="lg"
            fullWidth
            icon={Crosshair}
            disabled={locating}
            onClick={useCurrentLocation}
          >
            {locating ? 'جارٍ تحديد الموقع…' : 'استخدام الموقع الحالي'}
          </Button>

          <Input
            label="أو أدخل العنوان يدوياً"
            value={value.mode === 'manual' ? value.address : ''}
            onChange={(event) =>
              onChange({
                mode: 'manual',
                address: event.target.value,
                coords: null,
              })
            }
            placeholder="الحي، الشارع، أقرب معلم"
            height={52}
            fontSize={15}
            error={error}
            className="bg-white"
          />
        </div>

        <div
          aria-hidden="true"
          className="relative grid h-[120px] shrink-0 place-items-center overflow-hidden rounded-[12px] border border-primary-100 bg-white md:h-[168px] md:w-[220px]"
        >
          {/* Drawn stand-in for the map tile: a faint grid with a pin. */}
          <div className="absolute inset-0 bg-[linear-gradient(0deg,var(--color-line)_1px,transparent_1px),linear-gradient(90deg,var(--color-line)_1px,transparent_1px)] bg-[size:22px_22px] opacity-70" />
          <MapPin size={30} className="relative text-error-500" />
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

      {geoError ? (
        <p
          role="alert"
          className="text-right text-[12px] font-bold text-error-500"
        >
          {geoError}
        </p>
      ) : null}
    </div>
  )
}

export default LocationPicker
