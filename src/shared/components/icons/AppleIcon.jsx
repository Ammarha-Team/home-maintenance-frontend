// The Apple mark, lifted from the auth asset (assets/auth/icon-apple.svg).
//
// It lives here as markup rather than staying an <img> because it is a single
// solid shape with no colour of its own to keep: black on the light theme,
// unreadable on the dark one. An SVG loaded through <img> is a separate
// document and cannot see the page's `color`, so the mark could never follow
// the theme while it was a file reference. Inline, `currentColor` does it.
function AppleIcon({ className = '', ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 45 45"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...props}
    >
      <path d="M34.4197 23.8658C34.4809 30.4752 40.2184 32.6749 40.2817 32.703C40.2331 32.8577 39.3651 35.8376 37.2593 38.9148C35.4389 41.5754 33.5492 44.2262 30.5733 44.2818C27.649 44.3352 26.7085 42.5471 23.3648 42.5471C20.0222 42.5471 18.9777 44.2262 16.2091 44.3352C13.3362 44.4442 11.1484 41.4576 9.31287 38.8072C5.5624 33.3847 2.69612 23.4844 6.54467 16.8015C8.45647 13.4828 11.8737 11.3815 15.5823 11.3273C18.4032 11.2736 21.066 13.2251 22.7904 13.2251C24.5137 13.2251 27.7495 10.878 31.1512 11.2226C32.5754 11.282 36.5727 11.7977 39.1394 15.5552C38.9331 15.6835 34.3701 18.34 34.4197 23.8658ZM28.9237 7.63558C30.4488 5.78953 31.4754 3.2189 31.1955 0.661987C28.9969 0.750229 26.3383 2.12695 24.7616 3.9723C23.3483 5.60601 22.1108 8.22164 22.4444 10.7279C24.8952 10.9178 27.3983 9.48269 28.9237 7.63558Z" />
    </svg>
  )
}

export default AppleIcon
