import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { rewritePreviewMetadata } from "../../scripts/preview-metadata.mjs";

describe("preview metadata", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), "elevated-preview-metadata-"));
    mkdirSync(join(tempDir, "about"), { recursive: true });
  });

  afterEach(() => {
    rmSync(tempDir, { force: true, recursive: true });
  });

  it("rewrites canonical and Open Graph URL metadata to the preview URL", async () => {
    writeFileSync(
      join(tempDir, "index.html"),
      [
        '<link rel="canonical" href="https://www.elevatedthinking.co/" />',
        '<meta property="og:url" content="https://www.elevatedthinking.co/" />',
      ].join("\n")
    );
    writeFileSync(
      join(tempDir, "about", "index.html"),
      [
        '<link rel="canonical" href="https://www.elevatedthinking.co/about/" />',
        '<meta property="og:url" content="https://www.elevatedthinking.co/about/" />',
      ].join("\n")
    );

    await rewritePreviewMetadata({
      outDir: tempDir,
      previewBaseUrl:
        "https://delightful-plant-05da2520f.7.azurestaticapps.net/preview/pr/28/",
    });

    expect(readFileSync(join(tempDir, "index.html"), "utf8")).toContain(
      'href="https://delightful-plant-05da2520f.7.azurestaticapps.net/preview/pr/28/"'
    );
    expect(readFileSync(join(tempDir, "index.html"), "utf8")).toContain(
      'content="https://delightful-plant-05da2520f.7.azurestaticapps.net/preview/pr/28/"'
    );
    expect(
      readFileSync(join(tempDir, "about", "index.html"), "utf8")
    ).toContain(
      'href="https://delightful-plant-05da2520f.7.azurestaticapps.net/preview/pr/28/about/"'
    );
    expect(
      readFileSync(join(tempDir, "about", "index.html"), "utf8")
    ).toContain(
      'content="https://delightful-plant-05da2520f.7.azurestaticapps.net/preview/pr/28/about/"'
    );
  });
});
