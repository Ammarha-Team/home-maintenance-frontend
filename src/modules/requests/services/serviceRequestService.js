import api from '../../../shared/services/api'

// The normal (non-emergency) service request, end to end.
//
// Five endpoints, split by role — verified against the live API with the test
// accounts:
//
//   GET  /api/service-requests            client only    (technician -> 403)
//   POST /api/service-requests            client only
//   GET  /api/service-requests/{id}       client only
//   GET  /api/service-requests/available       technician only (client -> 403)
//   GET  /api/service-requests/available/{id}  technician only
//
// Nothing here sends a user id. Every endpoint reads the caller from the bearer
// token the shared client attaches, which is why none of them take one.
//
// Swagger documents all five as `200: OK` with no response schema. The request
// side is fully specified there and is followed exactly; the read side is not,
// and the API currently holds no service requests at all, so the field names
// read back in `toServiceRequest` are the ones Swagger names on the create
// command rather than shapes observed in a response. They are marked below and
// need backend confirmation.

const REQUESTS_PATH = '/api/service-requests'
const AVAILABLE_PATH = '/api/service-requests/available'

// ServiceRequestStatus is `enum: [1,2,3,4,5]` in Swagger with no names attached,
// so the numbers are passed through as the API's own vocabulary rather than
// being relabelled here.
export const SERVICE_REQUEST_STATUS_VALUES = [1, 2, 3, 4, 5]

// RequestType is `enum: [1,2]`, also unnamed. The request form offers exactly
// two hiring methods, which is the only two-valued choice it collects, so the
// selection is carried here. Which number means which method is not documented
// and is listed in the backend report.
export const REQUEST_TYPE = {
  chooseTechnician: 1,
  receiveOffers: 2,
}

// The dialog's own filter. Swagger types `Images` as an array of binary with no
// stated restriction, so this only matches what the upload hint on the form
// already promises the user.
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export const ACCEPTED_IMAGE_ATTR = `${ACCEPTED_TYPES.join(',')},.jpg,.jpeg,.png,.webp`

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024

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
const appendIfPresent = (body, key, value) => {
  if (value === null || value === undefined || value === '') return
  body.append(key, value)
}

/**
 * POST /api/service-requests — multipart, one request with its images.
 *
 * Answers with the created request's id as a bare GUID string (confirmed
 * against the live API, which returns the empty GUID in the same position when
 * it rejects the body).
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
  body.append('SaveAddress', request.saveAddress ? 'true' : 'false')

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

// Read-side field names.
//
// Swagger publishes no response schema for any of these endpoints, and the API
// holds no service requests to read one off, so every name below is the one
// Swagger uses for the same value on the create command — `problemDescription`
// for `ProblemDescription`, and so on — carried over in the camelCase the rest
// of this API answers in. They are unverified against a real payload; the raw
// object is kept on `raw` so a caller can reach anything this misses, and the
// mismatch risk is in the backend report.
const toServiceRequest = (dto) => ({
  id: dto?.id ?? null,
  status: typeof dto?.status === 'number' ? dto.status : null,
  serviceCategoryId: dto?.serviceCategoryId ?? null,
  serviceCategoryName: dto?.serviceCategoryName ?? '',
  problemDescription: dto?.problemDescription ?? '',
  preferredDate: dto?.preferredDate ?? null,
  preferredTime: dto?.preferredTime ?? null,
  requestType: typeof dto?.requestType === 'number' ? dto.requestType : null,
  addressLine: dto?.addressLine ?? '',
  city: dto?.city ?? '',
  country: dto?.country ?? '',
  latitude: typeof dto?.latitude === 'number' ? dto.latitude : null,
  longitude: typeof dto?.longitude === 'number' ? dto.longitude : null,
  images: Array.isArray(dto?.images) ? dto.images : [],
  createdAt: dto?.createdAt ?? null,
  raw: dto,
})

const toList = (payload) =>
  Array.isArray(payload) ? payload.map(toServiceRequest) : []

/**
 * GET /api/service-requests — the signed-in customer's own requests.
 *
 * Both filters are optional and are left off when not given, so the server
 * applies its own default rather than being handed an empty filter.
 *
 * @param {{status?: number, search?: string}} [filters]
 */
export const fetchMyServiceRequests = ({ status, search } = {}) => {
  const params = {}
  if (status) params.status = status
  if (search) params.search = search

  return api.get(REQUESTS_PATH, { params }).then(toList)
}

/** GET /api/service-requests/{id} — one of the customer's own requests. */
export const fetchServiceRequestById = (id) =>
  api.get(`${REQUESTS_PATH}/${id}`).then(toServiceRequest)

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

  return api.get(AVAILABLE_PATH, { params }).then(toList)
}

/** GET /api/service-requests/available/{id} — one open request, for a technician. */
export const fetchAvailableServiceRequestById = (id) =>
  api.get(`${AVAILABLE_PATH}/${id}`).then(toServiceRequest)
