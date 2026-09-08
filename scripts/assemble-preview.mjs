/**
 * Assembles the deployable preview site from already built targets.
 *
 * Target output is downloaded into dist/ by the workflow before this runs; this
 * script only adds the pieces that describe the site as a whole.
 */
import { copyFile, mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

import { buildPreviewIndexHtml } from "./preview-index.mjs";

const distDir = process.env.DIST_DIR ?? "dist";
const targets = JSON.parse(process.env.TARGETS_JSON ?? "[]");
const mainPreviewUrl = process.env.MAIN_PREVIEW_PATH ?? "/preview/";
const pullRequestPreviewBaseUrl =
  process.env.PULL_REQUEST_PREVIEW_BASE_URL ?? "";
const repository = process.env.GITHUB_REPOSITORY ?? "";

const availablePullRequests = targets
  .filter((target) => target.kind === "pr" && target.status === "ok")
  .map((target) => ({ number: target.number, title: target.title }));

await mkdir(distDir, { recursive: true });

await copyFile(
  "public/staticwebapp.config.json",
  `${distDir}/staticwebapp.config.json`
);

// Previews are behind Static Web Apps auth, but a crawler that does reach them
// should never index preview copies of production pages.
await writeFile(`${distDir}/robots.txt`, "User-agent: *\nDisallow: /\n");

const html = buildPreviewIndexHtml({
  mainPreviewUrl,
  openPullRequests: availablePullRequests,
  pullRequestPreviewBaseUrl,
  repository,
});
const indexPath = `${distDir}/index.html`;

await mkdir(dirname(indexPath), { recursive: true });
await writeFile(indexPath, html);

console.log(
  `Assembled preview index with ${availablePullRequests.length} pull request preview(s).`
);
