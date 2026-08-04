import { useEffect, useState } from 'react'
import { AlertTriangle, Loader2, SearchX } from 'lucide-react'
import Modal from '../../../shared/components/Modal.jsx'
import Select from '../../../shared/components/Select.jsx'
import Textarea from '../../../shared/components/Textarea.jsx'
import Button from '../../../shared/components/Button.jsx'
import LocationPicker from './LocationPicker.jsx'
import MediaDropzone from './MediaDropzone.jsx'
import TechnicianOfferCard from './TechnicianOfferCard.jsx'
import { PROBLEM_TYPES } from '../constants/emergency.js'
import {
  findAvailableTechnicians,
  submitEmergencyRequest,
} from '../services/emergencyService.js'

const EMPTY_LOCATION = { mode: 'manual', address: '', coords: null }

/**
 * The emergency request dialog.
 *
 * The frame put the technician list inside the same panel as the form, with no
 * state between "nothing chosen" and "three offers". That reads as a list of
 * results before there is a request to match them against, so the list here is
 * gated on a valid problem type and location, and it owns the three states a
 * lookup actually has: searching, empty, and results.
 */
function EmergencyRequestModal({ open, onClose, onConfirmed }) {
  const [problemType, setProblemType] = useState('')
  const [description, setDescription] = useState('')
  const [files, setFiles] = useState([])
  const [location, setLocation] = useState(EMPTY_LOCATION)
  const [errors, setErrors] = useState({})

  const [technicians, setTechnicians] = useState([])
  const [searching, setSearching] = useState(false)
  const [submittingId, setSubmittingId] = useState('')

  // Read as primitives so the lookup effect below can depend on the values
  // that actually change rather than on a fresh object every keystroke.
  const { address, coords } = location
  const hasLocation = Boolean(coords) || address.trim() !== ''
  const readyToSearch = problemType !== '' && hasLocation

  // Look up technicians once the request is specific enough to match against,
  // and again whenever it changes. The cancelled flag drops a response that
  // arrives after the inputs moved on.
  useEffect(() => {
    if (!open || !readyToSearch) {
      setTechnicians([])
      return undefined
    }

    let cancelled = false
    setSearching(true)

    findAvailableTechnicians({ problemType, address, coords })
      .then((results) => {
        if (cancelled) return
        setTechnicians(results)
      })
      .finally(() => {
        if (!cancelled) setSearching(false)
      })

    return () => {
      cancelled = true
    }
  }, [open, readyToSearch, problemType, address, coords])

  const validate = () => {
    const next = {}
    if (!problemType) next.problemType = 'اختر نوع المشكلة.'
    if (!hasLocation) next.location = 'حدّد موقع الخدمة.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSelect = async (technician) => {
    if (!validate()) return

    setSubmittingId(technician.id)
    try {
      const request = await submitEmergencyRequest({
        problemType,
        description,
        location,
        attachments: files.length,
        technicianId: technician.id,
      })
      onConfirmed({ technician, request })
    } finally {
      setSubmittingId('')
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="xl"
      title="خدمة الطوارئ"
      description="احصل على أقرب فني متاح في أسرع وقت للحالات العاجلة."
    >
      <div className="flex flex-col gap-[22px] md:gap-[26px]">
        <p className="flex items-start gap-[10px] rounded-[12px] border border-error-100 bg-error-50 px-[14px] py-[12px] text-right text-[13px] leading-[1.6] text-text-400">
          <AlertTriangle
            size={18}
            aria-hidden="true"
            className="mt-[2px] shrink-0 text-error-500"
          />
          للحالات التي تهدد السلامة (تسرب غاز، حريق، صعق كهربائي) اتصل بالجهات
          المختصة أولاً.
        </p>

        <Select
          label="نوع المشكلة"
          placeholder="اختر نوع المشكلة"
          value={problemType}
          options={PROBLEM_TYPES}
          error={errors.problemType}
          height={52}
          onChange={(event) => {
            setProblemType(event.target.value)
            setErrors((current) => ({ ...current, problemType: undefined }))
          }}
        />

        {/* Description and attachments sit side by side only once there is room
            for both to stay usable — stacked, the textarea keeps full width. */}
        <div className="grid gap-[18px] md:grid-cols-2">
          <Textarea
            label="وصف المشكلة"
            rows={5}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="اشرح لنا ما حدث باختصار…"
            hint="كلما زادت التفاصيل، وصل الفني مجهزاً."
          />

          <div className="flex flex-col gap-[10px]">
            <span className="text-right text-[15px] leading-[1.5] font-bold text-text-400 md:text-[18px]">
              صور أو فيديو (اختياري)
            </span>
            <MediaDropzone files={files} onChange={setFiles} />
          </div>
        </div>

        <section className="flex flex-col gap-[16px] md:gap-[24px]">
          <h3 className="text-right text-[16px] leading-[1.5] font-bold text-text-400 md:text-[20px]">
            موقع الخدمة
          </h3>
          <LocationPicker
            value={location}
            error={errors.location}
            onChange={(next) => {
              setLocation(next)
              setErrors((current) => ({ ...current, location: undefined }))
            }}
          />
        </section>

        <section className="flex flex-col gap-[14px]">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-[15px] leading-[1.5] font-bold text-text-400 md:text-[18px]">
              الفنيون المتاحون بالقرب منك
            </h3>
            {technicians.length > 0 ? (
              <span className="text-[13px] font-bold text-primary-600">
                {technicians.length} فنيين نشطين
              </span>
            ) : null}
          </div>

          {/* One live region covers all three states, so a screen reader hears
              the result of a search it did not trigger by hand. */}
          <div aria-live="polite" className="flex flex-col gap-[14px]">
            {!readyToSearch ? (
              <p className="rounded-[12px] border border-dashed border-line bg-card px-[16px] py-[22px] text-center text-[13px] leading-[1.6] text-text-300">
                اختر نوع المشكلة وحدّد الموقع لعرض الفنيين المتاحين.
              </p>
            ) : null}

            {readyToSearch && searching ? (
              <p className="flex items-center justify-center gap-[10px] rounded-[12px] border border-line bg-card px-[16px] py-[22px] text-[13px] font-bold text-text-400">
                <Loader2
                  size={18}
                  aria-hidden="true"
                  className="animate-spin text-primary-600"
                />
                جارٍ البحث عن أقرب فني متاح…
              </p>
            ) : null}

            {readyToSearch && !searching && technicians.length === 0 ? (
              <p className="flex flex-col items-center gap-[8px] rounded-[12px] border border-line bg-card px-[16px] py-[22px] text-center text-[13px] leading-[1.6] text-text-400">
                <SearchX
                  size={22}
                  aria-hidden="true"
                  className="text-text-300"
                />
                لا يوجد فني متاح الآن في نطاقك. جرّب توسيع الموقع أو أعد المحاولة
                بعد قليل.
              </p>
            ) : null}

            {readyToSearch && !searching && technicians.length > 0 ? (
              <ul className="grid gap-[14px] lg:grid-cols-2">
                {technicians.map((technician, index) => (
                  <li key={technician.id} className="h-full">
                    <TechnicianOfferCard
                      technician={technician}
                      index={index}
                      busy={submittingId === technician.id}
                      onSelect={handleSelect}
                    />
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </section>

        <Button variant="danger" size="sm" fullWidth onClick={onClose}>
          إلغاء الطلب
        </Button>
      </div>
    </Modal>
  )
}

export default EmergencyRequestModal
