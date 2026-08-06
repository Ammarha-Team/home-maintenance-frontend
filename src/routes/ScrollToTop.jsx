import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Opens a new page at its top.
 *
 * The browser restores scroll position on a real page load; a client-side route
 * change leaves it exactly where it was. That shows up wherever one screen's
 * button sits near the bottom of a long page — the next screen opens
 * part-scrolled, its heading already hidden behind the header.
 *
 * A jump rather than a smooth scroll: the previous page is gone, so animating
 * to the top of a different one only delays it.
 */
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export default ScrollToTop
