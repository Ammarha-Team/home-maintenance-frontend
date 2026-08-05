import Footer from '../components/Footer.jsx'
import HomeNavbar from '../components/HomeNavbar.jsx'

/**
 * Chrome for the signed-in pages: account header, page content, site footer.
 * Home builds the same stack inline; this pulls it into one place so the
 * emergency screens cannot drift from it.
 *
 * `contentClassName` exists because not every screen wants the same gutter —
 * the request screen runs a full-bleed hero under the header.
 */
function AppLayout({ children, contentClassName = '' }) {
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

      <HomeNavbar />

      <main id="main" className={`flex-1 ${contentClassName}`}>
        {children}
      </main>

      <Footer />
    </div>
  )
}

export default AppLayout
