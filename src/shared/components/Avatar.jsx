import { User } from 'lucide-react'

const SIZES = {
  sm: 'size-11',
  md: 'size-14',
  lg: 'size-16 md:size-20',
}

const DOT = {
  sm: 'size-3',
  md: 'size-3.5',
  lg: 'size-4',
}

/**
 * Round avatar with an optional presence dot. `name` is required even when an
 * image is present: it becomes the alt text, and the initial fallback when no
 * image is supplied.
 *
 * The presence dot is decorative — whatever it reflects is always written out
 * in text beside the avatar, so it carries aria-hidden rather than a label a
 * screen reader would announce out of context.
 */
function Avatar({ src, name, size = 'md', presence, className = '' }) {
  const initial = name?.trim()?.[0] ?? ''

  return (
    <span className={`relative inline-block shrink-0 ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          loading="lazy"
          className={`${SIZES[size]} rounded-full border border-line object-cover`}
        />
      ) : (
        <span
          aria-hidden="true"
          className={`${SIZES[size]} grid place-items-center rounded-full border border-line bg-card text-[16px] font-bold text-text-300`}
        >
          {initial || <User size={18} />}
        </span>
      )}

      {presence ? (
        <span
          aria-hidden="true"
          className={`absolute bottom-0 left-0 ${DOT[size]} rounded-full border-2 border-surface ${
            presence === 'online' ? 'bg-success-600' : 'bg-text-200'
          }`}
        />
      ) : null}
    </span>
  )
}

export default Avatar
