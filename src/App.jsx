import AppRoutes from "./routes/AppRoutes";
import { installAuthHandlers } from "./modules/auth/services/authBootstrap.js";

// Runs once, before the first render, so a request made by the first screen
// already carries the access token and can have it renewed.
installAuthHandlers();

function App() {
  return <AppRoutes />;
}

export default App;