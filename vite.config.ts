import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import Sitemap from "vite-plugin-sitemap";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

// vite-plugin-sitemap resolves its own output directory and defaults to the
// literal "dist" rather than following build.outDir, so both have to be told
// where the build is going. Preview builds set this; a production build uses
// the default.
const outDir = process.env.BUILD_OUT_DIR ?? "dist";

export default defineConfig({
  build: {
    outDir,
    rollupOptions: {
      input: {
        main: resolve(rootDir, "index.html"),
        about: resolve(rootDir, "about/index.html"),
        polaris: resolve(rootDir, "polaris/index.html"),
      },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    Sitemap({
      hostname: "https://www.elevatedthinking.co",
      // The plugin discovers "/" from the build output; add client-side routes here as the site grows.
      dynamicRoutes: [],
      generateRobotsTxt: true,
      robots: [{ userAgent: "*", allow: "/" }],
      readable: true,
      outDir,
    }),
  ],
});
