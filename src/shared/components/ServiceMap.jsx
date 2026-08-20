import { useEffect, useRef } from 'react'
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from 'react-leaflet'
import L from 'leaflet'

import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// Leaflet resolves its default marker sprites from a CSS-relative path that the
// bundler rewrites, so the icons come back 404 unless they are pointed at the
// imported assets. Done once here rather than in each screen that draws a map.
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

// Cairo — the fallback view before a position is picked.
const DEFAULT_CENTER = [30.0444, 31.2357]

function ClickToPick({ onPick }) {
  useMapEvents({
    click(event) {
      onPick({ lat: event.latlng.lat, lng: event.latlng.lng })
    },
  })

  return null
}

/**
 * Stops a zoom animation from outliving the map that started it.
 *
 * Every animated zoom ends with `setTimeout(_onZoomTransitionEnd, 250)`, queued
 * unconditionally so the animation still finishes on browsers that swallow
 * `transitionend`. Nothing cancels that timer, and `map.remove()` deletes
 * `_mapPane` while leaving `_animatingZoom` set — so a map torn down mid-zoom
 * leaves a callback that walks into `getPosition(undefined)` a quarter of a
 * second later and throws "Cannot read properties of undefined (reading
 * '_leaflet_pos')".
 *
 * Clearing the flag is what disarms it: `_onZoomTransitionEnd` opens with
 * `if (!this._animatingZoom) return`, so the queued call returns at Leaflet's
 * own guard instead of reaching for a pane that no longer exists. The order
 * against react-leaflet's own teardown does not matter — either way this runs
 * during unmount, long before the timer is due.
 *
 * This covers every animated zoom, not just the one at mount: a customer who
 * scroll-zooms and then leaves the page within 250ms would hit the same crash.
 */
function CancelPendingZoom() {
  const map = useMap()

  useEffect(
    () => () => {
      map._animatingZoom = false
    },
    [map],
  )

  return null
}

/**
 * Keeps Leaflet's idea of the container size in step with the real one.
 *
 * A map laid out at zero height — inside a panel that is still opening, or a
 * card that has not been given its height yet — measures nothing at init and
 * draws blank until it is told to measure again.
 */
function KeepMapSized() {
  const map = useMap()

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect

      // Measuring a collapsed container would only cache the same nothing.
      if (width > 0 && height > 0) map.invalidateSize({ animate: false })
    })

    observer.observe(map.getContainer())

    return () => observer.disconnect()
  }, [map])

  return null
}

// Recentres when the position changes from outside the map — geolocation, a
// typed address, a value restored from state. In an effect rather than during
// render so the map is told to move only after React commits the new position.
function FollowPosition({ position, zoom }) {
  const map = useMap()
  const [lat, lng] = position
  const settled = useRef(false)

  useEffect(() => {
    // The map is already mounted at this position and zoom, so the first run
    // would re-issue the view it is holding. That is not merely wasted work:
    // when the mounted zoom and the target zoom differ it plays a zoom
    // animation on every single mount, which is both a visible lurch as the
    // screen opens and the window in which a map removed early enough leaves a
    // pending animation behind.
    if (!settled.current) {
      settled.current = true
      return
    }

    map.setView([lat, lng], zoom)
  }, [map, lat, lng, zoom])

  return null
}

/**
 * The service-location map, shared by the request and emergency flows.
 *
 * Fully controlled: it draws whatever `value` holds and reports clicks through
 * `onChange`, so the surrounding screen owns the position and can combine it
 * with its own inputs. It renders the map surface only — no card, heading or
 * buttons — leaving each flow its own chrome.
 *
 * @param {{lat: number, lng: number}|null} value picked position, or null
 * @param {(next: {lat: number, lng: number}) => void} onChange
 * @param {string} className sizing for the map surface; the caller owns height
 */
function ServiceMap({
  value,
  onChange,
  className = 'h-[300px] w-full',
  zoom = 15,
  initialZoom = 13,
  ariaLabel = 'خريطة لتحديد موقع الخدمة',
}) {
  const position = value ? [value.lat, value.lng] : DEFAULT_CENTER

  // A map that already has a position opens at the zoom that position deserves.
  // The wider `initialZoom` is for the fallback view, where the point of the
  // map is to show enough of the city to find yourself in it.
  const mountZoom = value ? zoom : initialZoom

  return (
    <MapContainer
      center={position}
      zoom={mountZoom}
      className={className}
      aria-label={ariaLabel}
    >
      <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <Marker position={position} />

      <ClickToPick onPick={onChange} />

      <FollowPosition position={position} zoom={zoom} />

      <KeepMapSized />

      <CancelPendingZoom />
    </MapContainer>
  )
}

export default ServiceMap
