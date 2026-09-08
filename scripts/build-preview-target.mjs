/**
 * Builds a single preview target from the currently checked out commit.
 *
 * Each target is built in its own job from a plain checkout of its own ref, so
 * one pull request can never affect another pull request's preview.
 */
import { rm } from "node:fs/promises";
import { join } from "node:path";

import { build } from "vite";

import { rewritePreviewMetadata } from "./preview-metadata.mjs";

const previewBase = process.env.PREVIEW_BASE;
const previewUrl = process.env.PREVIEW_URL ?? "";
const outDir = process.env.OUT_DIR ?? "preview-out";

if (!previewBase) {
  throw new Error("PREVIEW_BASE is required (for example /preview/pr/42/).");
}

await rm(outDir, { recursive: true, force: true });

await build({
  base: previewBase,
  build: {
    emptyOutDir: true,
    outDir,
  },
});

await rewritePreviewMetadata({ outDir, previewBaseUrl: previewUrl });

// The Static Web Apps route configuration is only honoured at the site root, so
// the copy Vite lifts out of public/ is dropped from each nested preview.
await rm(join(outDir, "staticwebapp.config.json"), { force: true });

console.log(`Built preview for base ${previewBase} into ${outDir}`);
