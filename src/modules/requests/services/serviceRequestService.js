import api from '../../../shared/services/api'

// The normal (non-emergency) service request, end to end.
//
// Six endpoints, split by role — verified against the live API with the test
// accounts:
//
//   GET  /api/ServiceCategory                  any signed-in user
//   GET  /api/service-requests                 client only    (technician -> 403)
//   POST /api/service-requests                 client only
//   GET  /api/service-requests/{id}            client only
//   GET  /api/service-requests/available       technician only (client -> 403)
//   GET  /api/service-requests/available/{id}  technician only
//
// Nothing here sends a user id. Every endpoint reads the caller from the bearer
// token the shared client attaches, which is why none of them take one.
//
// Swagger publishes no response schema for any of them, so the field names in
// the mappers below were read off real payloads rather than inferred.

const REQUESTS_PATH = '/api/service-requests'
const AVAILABLE_PATH = '/api/service-requests/available'
const CATEGORIES_PATH = '/api/ServiceCategory'

// ServiceRequestStatus, as the backend defines it. Requests are filtered by the
// number and answered with the name, so both directions are written down.
export const SERVICE_REQUEST_STATUS = {
  pendingOffers: 1,
  assigned: 2,
  inProgress: 3,
  completed: 4,
  cancelled: 5,
}

export const SERVICE_REQUEST_STATUS_LABEL_AR = {
  PendingOffers: 'بانتظار العروض',
  Assigned: 'تم إسناد الطلب',
  InProgress: 'قيد التنفيذ',
  Completed: 'مكتملة',
  Cancelled: 'ملغية',
}

// RequestType. `direct` exists in the enum but is not in service yet — the
// backend asked for public requests only for now, so the form offers the one
// and this constant records why the other is untouched.
export const REQUEST_TYPE = {
  public: 1,
  direct: 2,
}

// The API names its categories in English and the customer reads Arabic. The
// five names below are the complete seeded set, checked against GET
// /api/ServiceCategory; anything the backend adds later falls back to its own
// name rather than disappearing from the list.
export const CATEGORY_LABEL_AR = {
  Plumbing: 'سباكة',
  Electrical: 'كهرباء',
  'Air Conditioning': 'تكييف',
  Carpentry: 'نجارة',
  Painting: 'دهانات',
}

export const categoryLabel = (name) => CATEGORY_LABEL_AR[name] ?? name ?? ''

// The dialog's own filter. Swagger types `Images` as an array of binary with no
// stated restriction, so this only matches what the upload hint on the form
// already promises the user.
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export const ACCEPTED_IMAGE_ATTR = `${ACCEPTED_TYPES.join(',')},.jpg,.jpeg,.png,.webp`

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024

export const MAX_IMAGE_COUNT = 5

/**
 * Guards one image before it joins the form.
 *
 * The `accept` filter is a convenience, not a control — a file still arrives
 * past it by drag and drop, or through a picker switched to "all files" — so
 * the type is checked here too.
 *
 * @param {File} file
 * @returns {string | null} an Arabic message, or null when the file is fine
 */
export const validateImageFile = (file) => {
  if (!file) return 'اختر صورة أولًا.'

  if (!ACCEPTED_TYPES.includes(file.type)) {
    return 'صيغة غير مدعومة. اختر صورة بصيغة JPG أو PNG أو WebP.'
  }

  if (file.size > MAX_IMAGE_BYTES) return 'حجم الصورة يتجاوز 5 ميجابايت.'

  return null
}

// `PreferredDate` is `format: date`, so the calendar's Date has to go out as a
// plain calendar day. `toISOString` would convert to UTC first and hand the
// server the previous day for anyone east of Greenwich — which is everyone this
// app serves.
const toApiDate = (date) => {
  if (!(date instanceof Date)) return ''

  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${date.getFullYear()}-${month}-${day}`
}

// A field the user left blank is left out of the body entirely rather than sent
// as an empty string: `AddressId` and `PreferredTime` are optional in the
// schema, and an empty value for a uuid or a time is not the same as no value.
// An omitted `PreferredTime` comes back as 00:00:00, which is what the form
// wants — it asks for a day, not an hour.
const appendIfPresent = (body, key, value) => {
  if (value === null || value === undefined || value === '') return
  body.append(key, value)
}

/** GET /api/ServiceCategory — the categories a request can be filed under. */
export const fetchServiceCategories = () =>
  api.get(CATEGORIES_PATH).then((payload) =>
    (Array.isArray(payload) ? payload : []).map((dto) => ({
      id: dto?.id ?? '',
      name: dto?.name ?? '',
      label: categoryLabel(dto?.name),
    })),
  )

/**
 * POST /api/service-requests — multipart, one request with its images.
 *
 * Answers with the created request's id as a bare GUID string, confirmed
 * against the live API.
 *
 * `saveAddress` decides what becomes of the address, and the two routes are not
 * symmetrical — both verified against the live API:
 *
 *   - `addressId` set, `saveAddress` false: accepted, and the request reads
 *     back cleanly afterwards. No new row is written, which is how a repeat
 *     customer stops stacking a near-identical address on every request.
 *   - a new address described in full, `saveAddress` false: the POST succeeds,
 *     but both detail endpoints then fail with a 500 — "Nullable object must
 *     have a value." — because no address row exists to join against. A new
 *     address therefore has to be saved for the request to be openable at all,
 *     which is why the form sends true whenever it sends a fresh pin.
 *
 * @param {{serviceCategoryId: string, problemDescription: string,
 *          preferredDate: Date|null, preferredTime?: string,
 *          requestType: number, addressId?: string, addressTitle?: string,
 *          addressLine?: string, city?: string, country?: string,
 *          latitude?: number, longitude?: number, saveAddress?: boolean,
 *          images?: File[]}} request
 * @param {(percent: number | null) => void} [onProgress]
 * @returns {Promise<string>} the new request's id
 */
export const createServiceRequest = (request, onProgress) => {
  const body = new FormData()

  appendIfPresent(body, 'ServiceCategoryId', request.serviceCategoryId)
  appendIfPresent(body, 'ProblemDescription', request.problemDescription)
  appendIfPresent(body, 'PreferredDate', toApiDate(request.preferredDate))
  appendIfPresent(body, 'PreferredTime', request.preferredTime)
  appendIfPresent(body, 'RequestType', request.requestType)

  // Either an address the customer already saved, or a new one described in
  // full. The server validates the second set only when no id is sent.
  appendIfPresent(body, 'AddressId', request.addressId)
  appendIfPresent(body, 'AddressTitle', request.addressTitle)
  appendIfPresent(body, 'AddressLine', request.addressLine)
  appendIfPresent(body, 'City', request.city)
  appendIfPresent(body, 'Country', request.country)
  appendIfPresent(body, 'Latitude', request.latitude)
  appendIfPresent(body, 'Longitude', request.longitude)
  body.append('SaveAddress', request.saveAddress === false ? 'false' : 'true')

  // `Images` is an array in the schema: the same key repeated, once per file.
  for (const image of request.images ?? []) {
    body.append('Images', image)
  }

  return api.post(REQUESTS_PATH, body, {
    // The shared client sends `application/json`; a multipart body needs a
    // boundary only the browser can generate, and clearing the header lets it.
    headers: { 'Content-Type': undefined },
    onUploadProgress: onProgress
      ? (event) => {
          // A percentage without a denominator is a fiction, so the caller is
          // told the size is unknown rather than shown one.
          onProgress(
            event.total ? Math.round((event.loaded * 100) / event.total) : null,
          )
        }
      : undefined,
  })
}

// The customer's own list. `status` arrives as the enum's name — "PendingOffers"
// — while the filter that selects it takes the number, so both travel together
// and no screen has to translate one into the other.
const toListItem = (dto) => ({
  id: dto?.requestId ?? '',
  categoryName: dto?.categoryName ?? '',
  categoryLabel: categoryLabel(dto?.categoryName),
  problemDescription: dto?.problemDescription ?? '',
  status: dto?.status ?? '',
  statusLabel: SERVICE_REQUEST_STATUS_LABEL_AR[dto?.status] ?? dto?.status ?? '',
  preferredDate: dto?.preferredDate ?? null,
  preferredTime: dto?.preferredTime ?? null,
  requestType: typeof dto?.requestType === 'number' ? dto.requestType : null,
  thumbnailImage: dto?.thumbnailImage ?? null,
  createdAt: dto?.createdAt ?? null,
})

// The customer's detail view. `images` is a plain array of URLs, and `offers`
// is carried through untouched — the offers screen owns that shape.
const toDetail = (dto) => ({
  ...toListItem(dto),
  address: dto?.address ?? '',
  latitude: typeof dto?.latitude === 'number' ? dto.latitude : null,
  longitude: typeof dto?.longitude === 'number' ? dto.longitude : null,
  images: Array.isArray(dto?.images) ? dto.images : [],
  offers: Array.isArray(dto?.offers) ? dto.offers : [],
})

// The technician's board. No `status` here — every request on it is open — and
// `city` in its place.
const toAvailableItem = (dto) => ({
  id: dto?.requestId ?? '',
  categoryName: dto?.categoryName ?? '',
  categoryLabel: categoryLabel(dto?.categoryName),
  problemDescription: dto?.problemDescription ?? '',
  preferredDate: dto?.preferredDate ?? null,
  preferredTime: dto?.preferredTime ?? null,
  city: dto?.city ?? '',
  thumbnailImage: dto?.thumbnailImage ?? null,
  createdAt: dto?.createdAt ?? null,
})

const toAvailableDetail = (dto) => ({
  ...toAvailableItem(dto),
  address: dto?.address ?? '',
  latitude: typeof dto?.latitude === 'number' ? dto.latitude : null,
  longitude: typeof dto?.longitude === 'number' ? dto.longitude : null,
  images: Array.isArray(dto?.images) ? dto.images : [],
  clientName: dto?.clientName ?? '',
  clientProfilePicture: dto?.clientProfilePicture ?? null,
  offersCount: typeof dto?.offersCount === 'number' ? dto.offersCount : 0,
})

const mapList = (payload, map) =>
  Array.isArray(payload) ? payload.map(map) : []

/**
 * GET /api/service-requests — the signed-in customer's own requests.
 *
 * `search` is offered by the API but not used by any caller: it matches the
 * English category name only, so an Arabic term — which is all this UI can
 * produce — never matches. Screens filter the returned list instead.
 *
 * @param {{status?: number, search?: string}} [filters]
 */
export const fetchMyServiceRequests = ({ status, search } = {}) => {
  const params = {}
  if (status) params.status = status
  if (search) params.search = search

  return api.get(REQUESTS_PATH, { params }).then((p) => mapList(p, toListItem))
}

/** GET /api/service-requests/{id} — one of the customer's own requests. */
export const fetchServiceRequestById = (id) =>
  api.get(`${REQUESTS_PATH}/${id}`).then(toDetail)

/**
 * GET /api/service-requests/available — open requests a technician may bid on.
 *
 * Technician-only: a client token is refused with 403, confirmed live.
 *
 * @param {{categoryId?: string, search?: string}} [filters]
 */
export const fetchAvailableServiceRequests = ({ categoryId, search } = {}) => {
  const params = {}
  if (categoryId) params.categoryId = categoryId
  if (search) params.search = search

  return api
    .get(AVAILABLE_PATH, { params })
    .then((p) => mapList(p, toAvailableItem))
}

/** GET /api/service-requests/available/{id} — one open request, for a technician. */
export const fetchAvailableServiceRequestById = (id) =>
  api.get(`${AVAILABLE_PATH}/${id}`).then(toAvailableDetail)
