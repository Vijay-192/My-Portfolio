import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { copyFileSync } from "fs";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "copy-redirects",
      closeBundle() {
        copyFileSync("public/_redirects", "dist/_redirects");
      },
    },
  ],
  build: {
    outDir: "dist",
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
});