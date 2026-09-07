import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Split heavy libraries into their own long-cached chunks so a page
        // that doesn't use them (most of the app) never pays to parse them,
        // and the map's Leaflet stack only downloads on the map routes
        // (which are React.lazy-loaded — see the route files).
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "map-vendor": [
            "leaflet",
            "react-leaflet",
            "react-leaflet-cluster",
            "leaflet.markercluster",
          ],
          "chart-vendor": ["recharts"],
        },
      },
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    globals: true,
  },
});
