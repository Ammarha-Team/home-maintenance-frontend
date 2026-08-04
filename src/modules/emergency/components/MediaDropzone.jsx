import { useId, useState } from 'react'
import { UploadCloud, X } from 'lucide-react'
import { MEDIA_LIMITS } from '../constants/emergency.js'

const formatSize = (bytes) => `${(bytes / (1024 * 1024)).toFixed(1)} م.ب`

/**
 * Optional photo/video attachment.
 *
 * The frame showed drag-and-drop only, which is a mouse-only affordance and
 * leaves phones — the likeliest device for an emergency — with no way in. The
 * control here is a real <label> wrapping a file input: it is reachable by
 * keyboard, opens the camera roll on touch, and still accepts a drop on
 * desktop. Selected files are listed with their own remove buttons rather than
 * being cleared as a batch.
 */
function MediaDropzone({ files, onChange }) {
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')
  const inputId = useId()
  const errorId = `${inputId}-error`

  const accept = (incoming) => {
    const next = []
    let rejected = ''

    for (const file of incoming) {
      if (file.size > MEDIA_LIMITS.maxBytes) {
        rejected = `تجاوز الملف ${file.name} الحد الأقصى ${formatSize(MEDIA_LIMITS.maxBytes)}.`
        continue
      }
      next.push(file)
    }

    if (files.length + next.length > MEDIA_LIMITS.maxFiles) {
      rejected = `يمكن إرفاق ${MEDIA_LIMITS.maxFiles} ملفات كحد أقصى.`
    }

    setError(rejected)
    onChange([...files, ...next].slice(0, MEDIA_LIMITS.maxFiles))
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setDragging(false)
    accept(Array.from(event.dataTransfer.files ?? []))
  }

  return (
    <div className="flex w-full flex-col gap-[10px]">
      <label
        htmlFor={inputId}
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`flex min-h-[120px] cursor-pointer flex-col items-center justify-center gap-[8px] rounded-[12px] border-2 border-dashed px-4 py-6 text-center transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary-500 md:min-h-[148px] ${
          dragging
            ? 'border-primary-500 bg-primary-50'
            : 'border-primary-100 bg-card hover:border-primary-500 hover:bg-primary-50'
        }`}
      >
        <UploadCloud size={26} aria-hidden="true" className="text-primary-600" />
        <span className="text-[14px] leading-[1.6] font-bold text-text-400">
          اضغط لاختيار الملفات
        </span>
        <span className="text-[12px] leading-[1.6] text-text-300">
          أو اسحبها وأفلتها هنا — حتى {MEDIA_LIMITS.maxFiles} ملفات،{' '}
          {formatSize(MEDIA_LIMITS.maxBytes)} للملف
        </span>

        <input
          id={inputId}
          type="file"
          multiple
          accept={MEDIA_LIMITS.accept}
          aria-describedby={error ? errorId : undefined}
          className="sr-only"
          onChange={(event) => {
            accept(Array.from(event.target.files ?? []))
            // Clear the input so re-picking the same file still fires change.
            event.target.value = ''
          }}
        />
      </label>

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="text-right text-[12px] font-bold text-error-500"
        >
          {error}
        </p>
      ) : null}

      {files.length > 0 ? (
        <ul className="flex flex-col gap-[8px]">
          {files.map((file) => (
            <li
              key={`${file.name}-${file.lastModified}`}
              className="flex items-center justify-between gap-3 rounded-[10px] border border-line bg-white px-[12px] py-[8px]"
            >
              <span className="min-w-0 flex-1 truncate text-right text-[13px] text-text-400">
                {file.name}
              </span>
              <span className="text-[12px] whitespace-nowrap text-text-300">
                {formatSize(file.size)}
              </span>
              <button
                type="button"
                onClick={() => onChange(files.filter((item) => item !== file))}
                aria-label={`إزالة ${file.name}`}
                className="grid size-11 shrink-0 place-items-center rounded-full text-text-300 transition-colors hover:bg-error-50 hover:text-error-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

export default MediaDropzone
