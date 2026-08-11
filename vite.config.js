import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// The API's CORS allowlist names the deployed origin and nothing else, so a
// call made straight from localhost is refused by the browser before it is
// sent — the trades behind the specialisation field are among the casualties.
//
// In development the requests go to this server instead, which forwards them
// on. Same origin as the page, so there is no preflight to fail; server to
// server, so there is no allowlist to be on. The target follows VITE_API_URL
// rather than being written out again, so pointing the app at a local backend
// still points the proxy with it. Nothing here reaches a production build,
// which talks to the API directly from an origin the allowlist knows.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    server: {
      proxy: {
        "/api": {
          target: env.VITE_API_URL,
          changeOrigin: true,
        },
      },
    },
  };
});
