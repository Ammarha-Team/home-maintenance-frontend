import api from './api'

// The signed-in customer's address book.
//
//   GET /api/Addresses/me   reads the caller from the bearer token
//
// Swagger publishes no response schema, so the shape below was read off a live
// payload. It is deliberately small: the endpoint answers with an id and a
// title and nothing else — no line, no city, no coordinates. A screen that
// wants to show where an address actually is cannot get that from here, which
// is why the picker in the request form identifies entries by title alone.
const ADDRESSES_PATH = '/api/Addresses/me'

const toAddress = (dto) => ({
  id: dto?.id ?? '',
  title: dto?.title ?? '',
})

/**
 * GET /api/Addresses/me — every address this customer has saved.
 *
 * @returns {Promise<Array<{id: string, title: string}>>} in the order the
 *   server returns them
 */
export const fetchMyAddresses = () =>
  api
    .get(ADDRESSES_PATH)
    .then((payload) => (Array.isArray(payload) ? payload.map(toAddress) : []))

/**
 * Labels a list of addresses for display, disambiguating repeated titles.
 *
 * Titles are not unique and in practice repeat a lot: every request filed
 * before the form asked for a name saved one under the same fixed title, so a
 * customer can hold several entries with identical text. Showing five identical
 * options is the same as showing none, so duplicates — and only duplicates —
 * carry a short reference drawn from their id.
 *
 * @param {Array<{id: string, title: string}>} addresses
 * @returns {Array<{id: string, title: string, label: string}>}
 */
export const withDistinctLabels = (addresses) => {
  const counts = new Map()
  for (const address of addresses) {
    counts.set(address.title, (counts.get(address.title) ?? 0) + 1)
  }

  return addresses.map((address) => ({
    ...address,
    label:
      counts.get(address.title) > 1
        ? `${address.title} — ${address.id.slice(0, 6)}`
        : address.title,
  }))
}
