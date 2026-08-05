import { useEffect, useId, useRef, useState } from 'react'
import { Crosshair, MapPin } from 'lucide-react'
import ServiceMap from '../../../shared/components/ServiceMap.jsx'
import {
  MIN_QUERY_LENGTH,
  SEARCH_DEBOUNCE_MS,
  reverseGeocode,
  searchAddress,
} from '../../../shared/services/geocoding.js'

/**
 * Service location: the device's position, a point on the map, or a typed
 * address — the three kept in step through Nominatim.
 *
 * Layout follows the Figma section (node 17:1697): a tinted panel holding the
 * map and the controls side by side, with the controls first in reading order
 * so the map lands on the left of the RTL row. The design's fixed 360/625 split
 * becomes a fixed-basis map beside a fluid column, and the row stacks under
 * `lg` so neither half is squeezed.
 *
 * `mode` records where the current value came from, and is what stops the two
 * directions of geocoding from chasing each other: only a typed address (mode
 * `manual`) triggers a forward search, and the reverse lookups that fill the
 * field from the map write mode `map` or `current` instead.
 */
function LocationPicker({ value, onChange, error }) {
  const [locating, setLocating] = useState(false)
  const [searching, setSearching] = useState(false)
  const [resolving, setResolving] = useState(false)
  const [geoError, setGeoError] = useState('')
  const fieldId = useId()
  const errorId = `${fieldId}-error`

  // Held in a ref so the debounced search below depends on the typed text
  // alone. The parent passes a new inline handler every render, and depending
  // on it would restart the timer on each keystroke of unrelated form state.
  const onChangeRef = useRef(onChange)
  useEffect(() => {
    onChangeRef.current = onChange
  })

  const reverseRequest = useRef(null)

  // Fills the address field from a position. Applies the coordinates first so
  // the marker moves immediately, then again with the address once it arrives —
  // a lookup over the network should not hold up the map.
  const applyPosition = async (coords, mode) => {
    reverseRequest.current?.abort()
    const controller = new AbortController()
    reverseRequest.current = controller

    onChange({ mode, address: '', coords })
    setGeoError('')
    setResolving(true)

    try {
      const address = await reverseGeocode(coords, { signal: controller.signal })
      if (controller.signal.aborted) return
      onChangeRef.current({ mode, address: address ?? '', coords })
    } catch (requestError) {
      if (requestError.name === 'AbortError') return
      setGeoError('تعذّر جلب العنوان لهذا الموقع. الإحداثيات محفوظة.')
    } finally {
      if (!controller.signal.aborted) setResolving(false)
    }
  }

  useEffect(() => () => reverseRequest.current?.abort(), [])

  // Forward search. Only a typed address runs it, so an address written into
  // the field by a reverse lookup cannot bounce back as a new search.
  const typed = value.mode === 'manual' ? value.address : ''

  useEffect(() => {
    if (typed.trim().length < MIN_QUERY_LENGTH) return undefined

    const controller = new AbortController()
    const timer = setTimeout(() => {
      setSearching(true)

      searchAddress(typed, { signal: controller.signal })
        .then((match) => {
          if (controller.signal.aborted) return

          if (!match) {
            setGeoError('لم نعثر على هذا العنوان. جرّب صياغة أخرى أو حدّده على الخريطة.')
            return
          }

          setGeoError('')
          onChangeRef.current({
            mode: 'manual',
            address: typed,
            coords: match.coords,
          })
        })
        .catch((requestError) => {
          if (requestError.name === 'AbortError') return
          setGeoError('تعذّر البحث عن العنوان الآن. حدّد موقعك على الخريطة.')
        })
        .finally(() => {
          if (!controller.signal.aborted) setSearching(false)
        })
    }, SEARCH_DEBOUNCE_MS)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [typed])

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
        applyPosition(
          { lat: position.coords.latitude, lng: position.coords.longitude },
          'current',
        )
      },
      () => {
        setLocating(false)
        setGeoError('تعذّر تحديد موقعك. أدخل العنوان يدوياً.')
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  // One status line, as before — it just has more to report now. Progress wins
  // over the resolved value so the user can tell a stale reading from a fresh
  // one while a lookup is still running.
  let status = 'حدّد موقعك ليصل الفني بأسرع وقت.'
  if (searching) status = 'جارٍ البحث عن العنوان…'
  else if (resolving) status = 'جارٍ تحديد العنوان…'
  else if (value.coords)
    status = `${value.coords.lat.toFixed(4)}، ${value.coords.lng.toFixed(4)}`
  else if (value.address) status = value.address

  const showLabel = !searching && !resolving && Boolean(value.coords || value.address)

  // The row splits at `lg`, not earlier: inside the dialog the panel is
  // narrower than the page, and at tablet width a side-by-side split left the
  // controls narrower than the map — the reverse of the design's proportion.
  // Below that the two stack at full width.
  return (
    <div className="flex flex-col gap-[16px] rounded-[20px] border border-line bg-primary-50 p-[16px] md:rounded-[24px] md:p-[20px] lg:flex-row lg:items-start lg:gap-[24px] lg:p-[25px]">
      {/* Controls come first in the DOM: they are the interactive half, and in
          an RTL row the first child is the rightmost — which is where the frame
          puts them, leaving the map on the left. */}
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
            {/* Shows the address whatever set it, so a point picked on the map
                reads back here as text rather than leaving the field empty. */}
            <input
              id={fieldId}
              type="text"
              value={value.address}
              onChange={(event) =>
                onChange({
                  mode: 'manual',
                  address: event.target.value,
                  // The last known position is kept while typing. Clearing it
                  // would send the map back to its default view between
                  // keystrokes, and the search replaces it when it resolves.
                  coords: value.coords,
                })
              }
              placeholder="شارع التخصصي، منطقة بوصلة"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
              className="h-full w-full bg-transparent py-[12px] text-right text-[16px] leading-[1.5] text-text-500 outline-none placeholder:text-text-300 md:text-[18px]"
            />
          </div>
        </div>

        <p
          aria-live="polite"
          className="text-right text-[13px] leading-[1.6] text-text-400"
        >
          {showLabel ? (
            <span className="font-bold text-text-500">الموقع المحدد: </span>
          ) : null}
          {status}
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

      {/* The map. Fixed basis from `lg` up so it holds the design's proportion
          beside the fluid column; full width when the row stacks. */}
      <div className="relative w-full shrink-0 overflow-hidden rounded-[16px] border border-accent-100 bg-white lg:w-[300px] xl:w-[360px]">
        <ServiceMap
          value={value.coords}
          onChange={(coords) => applyPosition(coords, 'map')}
          className="h-[150px] w-full sm:h-[172px] lg:h-[187px]"
        />
      </div>
    </div>
  )
}

export default LocationPicker
