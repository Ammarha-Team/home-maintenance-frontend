import { useEffect } from 'react'
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

// Recentres when the position changes from outside the map — geolocation, a
// typed address, a value restored from state. In an effect rather than during
// render so the map is told to move only after React commits the new position.
function FollowPosition({ position, zoom }) {
  const map = useMap()
  const [lat, lng] = position

  useEffect(() => {
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

  return (
    <MapContainer
      center={position}
      zoom={initialZoom}
      className={className}
      aria-label={ariaLabel}
    >
      <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <Marker position={position} />

      <ClickToPick onPick={onChange} />

      <FollowPosition position={position} zoom={zoom} />
    </MapContainer>
  )
}

export default ServiceMap
