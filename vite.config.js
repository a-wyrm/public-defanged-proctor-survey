import { defineConfig } from "vite";
import { fileURLToPath } from 'node:url';

import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    //establish a proxy from the dev server to express for the purpose of development
    proxy: {
      "/postsurvey": "http://localhost:8888",
    },

    build: {
      manifest: true,
      rollupOptions: {
        external: [
          fileURLToPath(
            new URL(
              'src/pages/Debug.jsx',
              import.meta.url
            )
          ),
        ],
      },
    },
  },
});
