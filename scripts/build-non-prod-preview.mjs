import { copyFile, rm } from "node:fs/promises";

import { build } from "vite";

import { rewritePreviewMetadata } from "./preview-metadata.mjs";

await rm("dist", { recursive: true, force: true });

await build({
  base: "/preview/",
  build: {
    emptyOutDir: false,
    outDir: "dist/preview",
  },
});

await rewritePreviewMetadata({
  outDir: "dist/preview",
  previewBaseUrl:
    process.env.MAIN_PREVIEW_BASE_URL ?? process.env.PREVIEW_BASE_URL ?? "",
});
await copyFile(
  "public/staticwebapp.config.json",
  "dist/staticwebapp.config.json"
);
await rm("dist/preview/staticwebapp.config.json", { force: true });
await import("./build-preview-index.mjs");
