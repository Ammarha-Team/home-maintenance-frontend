import Footer from '../components/Footer.jsx'
import TechnicianNavbar from '../components/TechnicianNavbar.jsx'

/**
 * Chrome for the technician portal: technician header, page content, site
 * footer.
 *
 * Mirrors `AppLayout`, which does the same for the customer pages. The two are
 * separate because the header differs — the customer's tabs and the
 * technician's are different sets — while the footer is the same site footer in
 * both, so it is reused rather than redrawn.
 */
function TechnicianLayout({ children, contentClassName = '' }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface font-cairo" dir="rtl">
      {/* Lets a keyboard user reach the page without tabbing the whole nav.
          Visible only while focused. */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:right-3 focus:z-[110] focus:rounded-lg focus:bg-primary-500 focus:px-4 focus:py-2 focus:text-[14px] focus:font-bold focus:text-white"
      >
        تخطّي إلى المحتوى
      </a>

      <TechnicianNavbar />

      <main id="main" className={`flex-1 ${contentClassName}`}>
        {children}
      </main>

      <Footer />
    </div>
  )
}

export default TechnicianLayout
