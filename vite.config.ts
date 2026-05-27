import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import Sitemap from "vite-plugin-sitemap";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(rootDir, "index.html"),
        about: resolve(rootDir, "about/index.html"),
      },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    Sitemap({
      hostname: "https://www.elevatedthinking.co",
      // The plugin discovers "/" from dist/index.html; add client-side routes here as the site grows.
      dynamicRoutes: [],
      generateRobotsTxt: true,
      robots: [{ userAgent: "*", allow: "/" }],
      readable: true,
    }),
  ],
});
