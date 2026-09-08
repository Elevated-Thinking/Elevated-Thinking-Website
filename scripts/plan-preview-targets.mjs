/**
 * CLI entry point for the preview plan. Reads the workflow environment and
 * writes the resolved plan to stdout as JSON.
 */
import { resolvePreviewTargets } from "./preview-targets.mjs";

const parseJson = (value, fallback) => {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch {
    throw new Error(`Expected JSON but received: ${value.slice(0, 120)}`);
  }
};

const splitList = (value) =>
  String(value ?? "")
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);

const plan = resolvePreviewTargets({
  botAuthors: splitList(
    process.env.BOT_AUTHORS ?? "dependabot[bot],github-actions[bot]"
  ),
  botPreviewLabel: process.env.BOT_PREVIEW_LABEL ?? "preview",
  cacheVersion: process.env.PREVIEW_CACHE_VERSION ?? "v1",
  mainBranch: process.env.MAIN_BRANCH ?? "main",
  mainPreviewPath: process.env.MAIN_PREVIEW_PATH ?? "/preview/",
  mainSha: process.env.MAIN_SHA ?? "",
  previewOrigin: process.env.PREVIEW_ORIGIN ?? "",
  prPreviewPathBase: process.env.PR_PREVIEW_PATH_BASE ?? "/preview/pr/",
  pullRequests: parseJson(process.env.OPEN_PRS_JSON, []),
  repository: process.env.GITHUB_REPOSITORY ?? "",
});

process.stdout.write(`${JSON.stringify(plan)}\n`);
