import AppRoutes from "./routes/AppRoutes";
import ThemeProvider from "./shared/theme/ThemeProvider.jsx";
import { installAuthHandlers } from "./modules/auth/services/authBootstrap.js";

// Runs once, before the first render, so a request made by the first screen
// already carries the access token and can have it renewed.
installAuthHandlers();

// The provider sits above the router so the theme survives navigation and is
// available to every screen, not only the ones under a particular layout.
function App() {
  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;