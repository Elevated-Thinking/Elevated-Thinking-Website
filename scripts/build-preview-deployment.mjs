import { spawn } from "node:child_process";
import { copyFile, mkdir, rm, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

import { buildPreviewIndexHtml } from "./preview-index.mjs";
import { rewritePreviewMetadata } from "./preview-metadata.mjs";

const assertCi = () => {
  if (
    process.env.CI !== "true" &&
    process.env.ALLOW_LOCAL_PREVIEW_DEPLOYMENT_BUILD !== "true"
  ) {
    throw new Error(
      "build-preview-deployment changes git checkout state. Run it in CI or set ALLOW_LOCAL_PREVIEW_DEPLOYMENT_BUILD=true."
    );
  }
};

const run = (command, args) =>
  new Promise((resolve, reject) => {
    console.log(`$ ${[command, ...args].join(" ")}`);
    const child = spawn(command, args, {
      env: process.env,
      stdio: "inherit",
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} exited with code ${code}`));
    });
  });

const normalizePathBase = (value) => {
  const withLeadingSlash = value.startsWith("/") ? value : `/${value}`;
  return withLeadingSlash.endsWith("/")
    ? withLeadingSlash
    : `${withLeadingSlash}/`;
};

const ensureTrailingSlash = (value) =>
  value.endsWith("/") ? value : `${value}/`;

const uniquePullRequests = (pullRequests) => {
  const seen = new Set();

  return pullRequests.filter((pullRequest) => {
    const number = Number(pullRequest.number);

    if (!Number.isInteger(number) || number <= 0 || seen.has(number)) {
      return false;
    }

    seen.add(number);
    pullRequest.number = number;
    return true;
  });
};

assertCi();

const openPullRequests = uniquePullRequests(
  JSON.parse(process.env.OPEN_PRS_JSON ?? "[]")
);
const mainBranch = process.env.MAIN_BRANCH ?? "main";
const mainPreviewUrl = process.env.MAIN_PREVIEW_URL ?? "/preview/";
const mainPreviewBaseUrl = process.env.MAIN_PREVIEW_BASE_URL ?? "";
const prPreviewPathBase = normalizePathBase(
  process.env.PR_PREVIEW_PATH_BASE ?? "/preview/pr/"
);
const pullRequestPreviewBaseUrl =
  process.env.PULL_REQUEST_PREVIEW_BASE_URL ?? prPreviewPathBase;
const repository = process.env.GITHUB_REPOSITORY ?? "";
const mainRef = `refs/remotes/origin/${mainBranch}`;

await rm("dist", { recursive: true, force: true });

await run("git", ["fetch", "--depth=1", "origin", `${mainBranch}:${mainRef}`]);
await run("git", ["checkout", "--force", mainRef]);
await run("npm", ["ci"]);
await run("npm", [
  "run",
  "build",
  "--",
  `--base=${mainPreviewUrl}`,
  "--outDir=dist/preview",
  "--emptyOutDir=false",
]);
await rewritePreviewMetadata({
  outDir: "dist/preview",
  previewBaseUrl: mainPreviewBaseUrl,
});
await copyFile(
  "public/staticwebapp.config.json",
  "dist/staticwebapp.config.json"
);
await rm("dist/preview/staticwebapp.config.json", { force: true });

for (const pullRequest of openPullRequests) {
  const previewBase = `${prPreviewPathBase}${pullRequest.number}/`;
  const outDir = `dist/preview/pr/${pullRequest.number}`;

  await run("git", [
    "fetch",
    "--depth=1",
    "origin",
    `pull/${pullRequest.number}/head`,
  ]);
  await run("git", ["checkout", "--force", "FETCH_HEAD"]);
  await run("npm", ["ci"]);
  await run("npm", [
    "run",
    "build",
    "--",
    `--base=${previewBase}`,
    `--outDir=${outDir}`,
    "--emptyOutDir=false",
  ]);
  await rewritePreviewMetadata({
    outDir,
    previewBaseUrl: `${ensureTrailingSlash(pullRequestPreviewBaseUrl)}${pullRequest.number}/`,
  });
  await rm(`${outDir}/staticwebapp.config.json`, { force: true });
}

const html = buildPreviewIndexHtml({
  mainPreviewUrl,
  openPullRequests,
  pullRequestPreviewBaseUrl,
  repository,
});
const outputPath = "dist/index.html";

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, html);
await run("git", ["checkout", "--force", mainRef]);
