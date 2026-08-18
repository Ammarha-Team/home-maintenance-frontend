import api from '../../../shared/services/api'

// The technician's own profile, and the three uploads that feed it.
//
// Swagger documents every one of these as `200: OK` with no response schema, so
// the shapes below were read off the live API with a real technician account
// rather than guessed. Recorded here because the spec cannot be consulted for
// them:
//
//   GET   /api/Technician/me/profile
//     { id, fullName, profilePictureUrl, profession, rating,
//       completedTasksCount, yearsOfExperience, location, phoneNumber, email,
//       bio, portfolio: [{ id, imageUrl, title, description }] }
//
//   PATCH /api/Technician/me/profile   -> true
//   POST  /api/Technician/me/portfolio -> { id, imageUrl, title, description }
//   POST  /api/Accounts/upload-profile-picture -> "https://…" (a bare string)
//
// `id` on the profile is the technician record, not the account. Nothing here
// sends a user id: every endpoint reads the caller from the bearer token that
// the shared client attaches, which is also why none of them take one.

const PROFILE_PATH = '/api/Technician/me/profile'
const PORTFOLIO_PATH = '/api/Technician/me/portfolio'
const PICTURE_PATH = '/api/Accounts/upload-profile-picture'

// The Figma upload hints promise "Max 5MB", so the UI is held to its own word.
// The API has no documented limit; this only spares the user a long upload that
// the server may then refuse.
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

// What the file dialog itself will offer.
//
// The extensions ride along with the MIME types because the two are not
// interchangeable in a native picker: some systems match a dialog filter by
// extension and would otherwise grey out files the app is happy to take.
export const ACCEPTED_IMAGE_ATTR = `${ACCEPTED_TYPES.join(',')},.jpg,.jpeg,.png,.webp`

/**
 * Guards an image before it is sent.
 *
 * The dialog's `accept` filter is a convenience, not a control — a file can
 * still arrive past it by drag and drop, or by a picker that lets the user
 * switch to "all files" — so the type is checked here as well.
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

const toPortfolioItem = (dto) => ({
  id: dto?.id ?? null,
  imageUrl: dto?.imageUrl ?? '',
  title: dto?.title ?? '',
  description: dto?.description ?? '',
})

// The fields the page only displays keep their nulls — `profession: null` is
// "not set yet", and the header should be able to tell that apart from a value
// the technician cleared. The editable text fields are the exception: they feed
// inputs, and a controlled input handed null warns and then goes uncontrolled.
const toProfile = (dto) => ({
  id: dto?.id ?? null,
  fullName: dto?.fullName ?? '',
  profilePictureUrl: dto?.profilePictureUrl ?? null,
  profession: dto?.profession ?? null,
  rating: typeof dto?.rating === 'number' ? dto.rating : 0,
  completedTasksCount:
    typeof dto?.completedTasksCount === 'number' ? dto.completedTasksCount : 0,
  yearsOfExperience:
    typeof dto?.yearsOfExperience === 'number' ? dto.yearsOfExperience : null,
  location: dto?.location ?? '',
  phoneNumber: dto?.phoneNumber ?? '',
  email: dto?.email ?? '',
  bio: dto?.bio ?? '',
  portfolio: Array.isArray(dto?.portfolio)
    ? dto.portfolio.map(toPortfolioItem)
    : [],
})

/** GET /api/Technician/me/profile — the signed-in technician. */
export const fetchMyProfile = () => api.get(PROFILE_PATH).then(toProfile)

// The only four fields the endpoint accepts. Anything else on the page —
// profession, years of experience, skills, services, certificates — has no
// counterpart in `UpdateTechnicianProfileCommand` and cannot be saved.
export const EDITABLE_FIELDS = ['fullName', 'phoneNumber', 'location', 'bio']

/**
 * PATCH /api/Technician/me/profile.
 *
 * A field left out of the body is left alone by the server — verified against
 * the live API, where a bio-only patch preserved a location set by an earlier
 * call. So only the fields the caller actually names are sent, and an untouched
 * field is never at risk of being overwritten by a stale value from the form.
 *
 * @param {{fullName?: string, phoneNumber?: string, location?: string,
 *          bio?: string}} changes
 */
export const updateMyProfile = (changes) => {
  const body = EDITABLE_FIELDS.reduce(
    (acc, field) =>
      changes[field] === undefined ? acc : { ...acc, [field]: changes[field] },
    {},
  )

  return api.patch(PROFILE_PATH, body)
}

// Multipart, not JSON.
//
// The shared client sets `Content-Type: application/json` for every request, and
// a multipart body needs a boundary that only the browser can generate. Clearing
// the header lets it do that; setting the type by hand would produce a
// boundary-less header the server cannot parse.
const uploadConfig = (onProgress) => ({
  headers: { 'Content-Type': undefined },
  onUploadProgress: onProgress
    ? (event) => {
        // `total` is absent when the size is unknown, and a percentage without a
        // denominator is a fiction. The caller is told so rather than shown one.
        const percent = event.total
          ? Math.round((event.loaded * 100) / event.total)
          : null

        onProgress(percent)
      }
    : undefined,
})

/**
 * POST /api/Accounts/upload-profile-picture.
 *
 * Answers with the hosted URL as a bare string. The profile is not re-read
 * here — the caller decides whether to refresh.
 *
 * @param {File} file
 * @param {(percent: number | null) => void} [onProgress]
 * @returns {Promise<string>}
 */
export const uploadProfilePicture = (file, onProgress) => {
  const body = new FormData()
  body.append('image', file)

  return api.post(PICTURE_PATH, body, uploadConfig(onProgress))
}

/**
 * POST /api/Technician/me/portfolio — one image per call.
 *
 * `title` and `description` are part of the documented form. The Figma gallery
 * collects neither, so the file's own name is sent as the title: it is the only
 * thing the user actually chose, and an empty title would leave the record
 * unlabelled for whoever reads it later.
 *
 * @param {{file: File, title?: string, description?: string}} item
 * @param {(percent: number | null) => void} [onProgress]
 * @returns {Promise<{id: string, imageUrl: string, title: string,
 *                    description: string}>}
 */
export const addPortfolioItem = ({ file, title, description }, onProgress) => {
  const body = new FormData()
  body.append('image', file)
  body.append('title', title ?? file.name)
  body.append('description', description ?? '')

  return api
    .post(PORTFOLIO_PATH, body, uploadConfig(onProgress))
    .then(toPortfolioItem)
}
