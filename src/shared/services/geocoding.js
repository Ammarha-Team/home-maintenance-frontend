// Address lookup for the Leaflet maps, backed by Nominatim — the same
// OpenStreetMap project the tiles come from, so no extra provider or key.
//
// Nominatim's usage policy caps anonymous traffic at roughly one request per
// second. A browser cannot set its own User-Agent to identify itself, so the
// callers carry that weight instead: debounce with SEARCH_DEBOUNCE_MS and pass
// an AbortSignal, which keeps a burst of keystrokes down to one live request.
const ENDPOINT = 'https://nominatim.openstreetmap.org'

// Long enough that a typed address is not searched word by word, and
// comfortably above Nominatim's one-per-second ceiling.
export const SEARCH_DEBOUNCE_MS = 700

// Below this a query matches half the map; not worth a request.
export const MIN_QUERY_LENGTH = 3

const COMMON_PARAMS = {
  format: 'jsonv2',
  'accept-language': 'ar',
}

async function request(path, params, signal) {
  const url = new URL(`${ENDPOINT}/${path}`)
  Object.entries({ ...COMMON_PARAMS, ...params }).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })

  const response = await fetch(url, { signal })
  if (!response.ok) {
    throw new Error(`Geocoding request failed: ${response.status}`)
  }

  return response.json()
}

/**
 * Address text to a position. Returns null when nothing matches, which is an
 * ordinary outcome for a half-typed address rather than a failure.
 *
 * @returns {Promise<{coords: {lat: number, lng: number}, address: string}|null>}
 */
export async function searchAddress(query, { signal } = {}) {
  const trimmed = query.trim()
  if (trimmed.length < MIN_QUERY_LENGTH) return null

  const results = await request('search', { q: trimmed, limit: 1 }, signal)
  const match = Array.isArray(results) ? results[0] : null
  if (!match) return null

  return {
    coords: { lat: Number(match.lat), lng: Number(match.lon) },
    address: match.display_name,
  }
}

/**
 * Position to address text. Returns null when the point has no known address —
 * open water, empty desert — so the caller can fall back to coordinates.
 *
 * @returns {Promise<string|null>}
 */
export async function reverseGeocode({ lat, lng }, { signal } = {}) {
  const result = await request('reverse', { lat, lon: lng }, signal)
  if (!result || result.error) return null

  return result.display_name ?? null
}

/**
 * Position to the separate address parts a service request has to carry.
 *
 * The request API needs a line, a city and a country as three fields, and the
 * map collects a pin. `reverseGeocode` above answers with one display string,
 * which cannot be split apart reliably — Nominatim orders it by locale and by
 * what it knows about the place — so this asks for the structured breakdown
 * instead and reads the fields straight out.
 *
 * A place can be missing any of them: a pin in open desert has no city, and
 * `addressdetails` names the settlement differently by size. Every part is
 * therefore optional, and the caller decides what to do with a gap.
 *
 * @returns {Promise<{line: string, city: string, country: string}|null>} null
 *   when the point has no known address at all
 */
export async function reverseGeocodeParts({ lat, lng }, { signal } = {}) {
  const result = await request(
    'reverse',
    { lat, lon: lng, addressdetails: 1 },
    signal,
  )
  if (!result || result.error) return null

  const parts = result.address ?? {}

  // The street on its own, not the whole display name. The server stores the
  // line and then writes the address back as "line, city, country", so a line
  // that already ends in the city and the country reads with both of them
  // twice. Nothing narrower than a neighbourhood is guaranteed, hence the
  // fallback.
  const street = [
    parts.house_number,
    parts.road,
    parts.neighbourhood ?? parts.suburb,
  ]
    .filter(Boolean)
    .join(' ')

  return {
    line: street || result.display_name || '',
    // Largest to smallest: whichever of these the place has is its city.
    city:
      parts.city ??
      parts.town ??
      parts.village ??
      parts.municipality ??
      parts.state ??
      '',
    country: parts.country ?? '',
  }
}
