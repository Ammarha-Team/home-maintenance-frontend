import { useCallback, useEffect, useRef, useState } from 'react'

import {
  addPortfolioItem,
  fetchMyProfile,
  updateMyProfile,
  uploadProfilePicture,
  validateImageFile,
} from '../services/technicianProfileService'

// All of the profile page's talking to the server, in one place.
//
// The page is four cards that each own a slice of the same record, so the
// record — and every in-flight state around it — lives here rather than in any
// one card. A card that saves does not have to tell the others; they read the
// same object.

// `preview` and `pending` carry object URLs for the files being sent, so the
// user sees what they picked straight away instead of waiting on a round trip
// to find out the click registered at all.
const IDLE_UPLOAD = { busy: false, percent: null, error: null, preview: null }
const IDLE_PORTFOLIO = { busy: false, percent: null, error: null, pending: [] }

export function useTechnicianProfile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})

  const [avatar, setAvatar] = useState(IDLE_UPLOAD)
  const [portfolio, setPortfolio] = useState(IDLE_PORTFOLIO)

  // A reload that lands after the component is gone would set state on nothing.
  const alive = useRef(true)

  useEffect(() => {
    alive.current = true

    return () => {
      alive.current = false
    }
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const next = await fetchMyProfile()
      if (alive.current) setProfile(next)
    } catch (failure) {
      // A 401 never reaches here: the shared client renews the token once and,
      // failing that, ends the session and sends the user to the login screen.
      // What arrives is a real failure worth showing.
      if (alive.current) setError(failure.message)
    } finally {
      if (alive.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  /**
   * Saves the four editable fields.
   *
   * The server answers `true`, not the updated record, so the local copy is
   * patched from what was sent. Re-reading would cost a round trip to learn
   * something already known.
   *
   * @returns {Promise<boolean>} whether it saved
   */
  const saveProfile = useCallback(async (changes) => {
    setSaving(true)
    setSaveError(null)
    setFieldErrors({})

    try {
      await updateMyProfile(changes)
      if (alive.current) setProfile((current) => ({ ...current, ...changes }))

      return true
    } catch (failure) {
      if (alive.current) {
        setSaveError(failure.message)
        setFieldErrors(failure.fieldErrors ?? {})
      }

      return false
    } finally {
      if (alive.current) setSaving(false)
    }
  }, [])

  /**
   * Replaces the profile picture.
   *
   * The endpoint hands back the hosted URL, which is written straight into the
   * local record — the picture changes as soon as the upload finishes, without
   * re-reading the whole profile for one field.
   */
  const changeAvatar = useCallback(async (file) => {
    const invalid = validateImageFile(file)

    if (invalid) {
      setAvatar({ ...IDLE_UPLOAD, error: invalid })
      return false
    }

    // Shown immediately, so the new picture is on screen while it uploads.
    const preview = URL.createObjectURL(file)
    setAvatar({ busy: true, percent: 0, error: null, preview })

    try {
      const url = await uploadProfilePicture(file, (percent) => {
        if (alive.current) setAvatar((current) => ({ ...current, percent }))
      })

      // The hosted copy is fetched before the preview is dropped, so the swap
      // is invisible. Without this the picture blanks for as long as the CDN
      // takes to answer, right after the user was told it worked.
      await new Promise((resolve) => {
        const image = new Image()
        image.onload = resolve
        image.onerror = resolve
        image.src = url
      })

      if (alive.current) {
        setProfile((current) => ({ ...current, profilePictureUrl: url }))
        setAvatar(IDLE_UPLOAD)
      }

      return true
    } catch (failure) {
      // The preview goes with it: leaving the picture on screen would say the
      // upload worked.
      if (alive.current) {
        setAvatar({ ...IDLE_UPLOAD, error: failure.message })
      }

      return false
    } finally {
      URL.revokeObjectURL(preview)
    }
  }, [])

  /**
   * Adds work images to the gallery.
   *
   * The endpoint takes one image per call, so a multi-file selection is sent
   * one at a time. Each success is appended immediately rather than collected
   * to the end: if the fourth of five fails, the first three are already on the
   * server and the gallery should say so.
   *
   * @param {File[]} files
   * @returns {Promise<{added: number, failed: number}>}
   */
  const addPortfolioImages = useCallback(async (files) => {
    const chosen = Array.from(files ?? [])
    if (chosen.length === 0) return { added: 0, failed: 0 }

    // Thumbnails for the whole selection, on screen before the first request
    // leaves. `key` is what ties a placeholder to the file it stands for, so
    // each one can be removed as its upload settles.
    const previews = chosen.map((file, index) => ({
      key: `${Date.now()}-${index}`,
      url: URL.createObjectURL(file),
      name: file.name,
    }))

    const drop = (key) =>
      setPortfolio((current) => ({
        ...current,
        pending: current.pending.filter((item) => item.key !== key),
      }))

    setPortfolio({ busy: true, percent: 0, error: null, pending: previews })

    let added = 0
    let failed = 0
    let lastError = null

    for (const [index, file] of chosen.entries()) {
      const { key, url: previewUrl } = previews[index]
      const invalid = validateImageFile(file)

      if (invalid) {
        failed += 1
        lastError = invalid
        drop(key)
        URL.revokeObjectURL(previewUrl)
        continue
      }

      try {
        const item = await addPortfolioItem({ file }, (percent) => {
          if (!alive.current || percent === null) return

          // One bar for the whole selection: the file's own progress, scaled
          // into its share of the batch.
          const scaled = Math.round(
            ((index + percent / 100) / chosen.length) * 100,
          )

          setPortfolio((current) => ({ ...current, percent: scaled }))
        })

        added += 1

        if (alive.current) {
          setProfile((current) => ({
            ...current,
            portfolio: [...current.portfolio, item],
          }))
        }
      } catch (failure) {
        failed += 1
        lastError = failure.message
      } finally {
        // The placeholder gives way to the real tile on success, and simply
        // disappears on failure — either way it must not outlive the request.
        drop(key)
        URL.revokeObjectURL(previewUrl)
      }
    }

    if (alive.current) {
      setPortfolio({ ...IDLE_PORTFOLIO, error: failed ? lastError : null })
    }

    return { added, failed }
  }, [])

  return {
    profile,
    loading,
    error,
    reload: load,

    saving,
    saveError,
    fieldErrors,
    saveProfile,

    avatar,
    changeAvatar,

    portfolio,
    addPortfolioImages,
  }
}
