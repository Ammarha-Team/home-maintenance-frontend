import AppRoutes from "./routes/AppRoutes";
import ThemeProvider from "./shared/theme/ThemeProvider.jsx";
import ToastProvider from "./shared/toast/ToastProvider.jsx";
import { installAuthHandlers } from "./modules/auth/services/authBootstrap.js";

// Runs once, before the first render, so a request made by the first screen
// already carries the access token and can have it renewed.
installAuthHandlers();

// Both providers sit above the router so what they hold survives navigation and
// is available to every screen, not only the ones under a particular layout.
// For the toasts that matters twice over: a message raised as a screen sends
// someone onwards is still on show when the next screen arrives.
function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;