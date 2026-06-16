import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";

const htmlFileName = "index.html";
const absoluteHttpUrlPattern = /^https?:\/\//i;

const ensureTrailingSlash = (value) =>
  value.endsWith("/") ? value : `${value}/`;

const findHtmlFiles = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const filePath = join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await findHtmlFiles(filePath)));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(filePath);
    }
  }

  return files;
};

const routePathForHtml = (outDir, filePath) => {
  const relativePath = relative(outDir, filePath).split(sep).join("/");

  if (relativePath === htmlFileName) {
    return "";
  }

  if (relativePath.endsWith(`/${htmlFileName}`)) {
    return relativePath.slice(0, -htmlFileName.length);
  }

  return relativePath.replace(/\.html$/, "");
};

const previewUrlForRoute = (previewBaseUrl, routePath) =>
  new URL(routePath, ensureTrailingSlash(previewBaseUrl)).href;

const rewriteHtmlMetadata = (html, previewUrl) =>
  html
    .replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/i, `$1${previewUrl}$2`)
    .replace(
      /(<meta\s+property="og:url"\s+content=")[^"]*(")/i,
      `$1${previewUrl}$2`
    );

export const rewritePreviewMetadata = async ({ outDir, previewBaseUrl }) => {
  if (!absoluteHttpUrlPattern.test(previewBaseUrl ?? "")) {
    return [];
  }

  const htmlFiles = await findHtmlFiles(outDir);
  const rewritten = [];

  for (const filePath of htmlFiles) {
    const routePath = routePathForHtml(outDir, filePath);
    const previewUrl = previewUrlForRoute(previewBaseUrl, routePath);
    const html = await readFile(filePath, "utf8");
    const nextHtml = rewriteHtmlMetadata(html, previewUrl);

    if (nextHtml === html) {
      continue;
    }

    await writeFile(filePath, nextHtml);
    rewritten.push({ filePath, previewUrl });
  }

  return rewritten;
};
