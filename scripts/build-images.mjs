import { mkdir, readdir, rm, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");
const sourceDir = join(rootDir, ".cache", "image-sources");
const outputDir = join(rootDir, "src", "assets", "images", "optimized");

const widths = [640, 960, 1280, 1600];
const defaultAspectRatio = 5 / 4;
const totalBudgetBytes = 10 * 1024 * 1024;
const assetBudgetBytes = 500 * 1024;

const images = [
  {
    slug: "hero",
    cropPosition: "center",
  },
  {
    slug: "product-strategy",
    cropPosition: "center",
  },
  {
    slug: "service-workflow",
    cropPosition: "center",
  },
  {
    slug: "ux-research",
    cropPosition: "center",
  },
  {
    slug: "ai-delivery",
    cropPosition: "center",
  },
  {
    slug: "polaris-hero",
    cropPosition: "center",
    aspectRatio: 9 / 16,
  },
];

async function pathExists(path) {
  try {
    await stat(path);
    return true;
  } catch (error) {
    if (error?.code === "ENOENT") {
      return false;
    }

    throw error;
  }
}

async function localSourcePath(image) {
  const sourcePath = join(sourceDir, `${image.slug}.jpg`);

  if (await pathExists(sourcePath)) {
    return sourcePath;
  }

  throw new Error(
    `Missing local source image: ${sourcePath.replace(
      `${rootDir}/`,
      ""
    )}. Place a JPG source file there before running this command.`
  );
}

async function buildVariant({
  sourcePath,
  slug,
  cropPosition,
  aspectRatio,
  width,
  format,
}) {
  const height = Math.round(width * (aspectRatio ?? defaultAspectRatio));
  const outputPath = join(outputDir, `${slug}-${width}.${format.extension}`);

  let pipeline = sharp(sourcePath)
    .rotate()
    .resize({
      width,
      height,
      fit: "cover",
      position: cropPosition,
    })
    .toColorspace("srgb");

  if (format.extension === "avif") {
    pipeline = pipeline.avif({ quality: 50, effort: 6 });
  }

  if (format.extension === "webp") {
    pipeline = pipeline.webp({ quality: 76, effort: 6 });
  }

  if (format.extension === "jpg") {
    pipeline = pipeline.jpeg({
      quality: 78,
      mozjpeg: true,
      progressive: true,
    });
  }

  await pipeline.toFile(outputPath);
  return outputPath;
}

async function getGeneratedAssets() {
  const filenames = await readdir(outputDir);
  return filenames
    .filter((filename) => /\.(avif|webp|jpg)$/.test(filename))
    .map((filename) => join(outputDir, filename));
}

function formatBytes(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

async function enforceBudgets() {
  let totalBytes = 0;
  const oversizeAssets = [];

  for (const assetPath of await getGeneratedAssets()) {
    const { size } = await stat(assetPath);
    totalBytes += size;

    if (size > assetBudgetBytes) {
      oversizeAssets.push({ assetPath, size });
    }
  }

  if (oversizeAssets.length > 0) {
    throw new Error(
      [
        `Image asset budget exceeded. Max per asset: ${formatBytes(
          assetBudgetBytes
        )}.`,
        ...oversizeAssets.map(
          ({ assetPath, size }) =>
            `- ${assetPath.replace(`${rootDir}/`, "")}: ${formatBytes(size)}`
        ),
      ].join("\n")
    );
  }

  if (totalBytes > totalBudgetBytes) {
    throw new Error(
      `Generated image set is ${formatBytes(totalBytes)}, above ${formatBytes(
        totalBudgetBytes
      )}.`
    );
  }

  console.log(`Generated image set: ${formatBytes(totalBytes)}.`);
}

await mkdir(sourceDir, { recursive: true });
await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });

for (const image of images) {
  const sourcePath = await localSourcePath(image);

  for (const width of widths) {
    await buildVariant({
      sourcePath,
      slug: image.slug,
      cropPosition: image.cropPosition,
      aspectRatio: image.aspectRatio,
      width,
      format: { extension: "avif" },
    });
    await buildVariant({
      sourcePath,
      slug: image.slug,
      cropPosition: image.cropPosition,
      aspectRatio: image.aspectRatio,
      width,
      format: { extension: "webp" },
    });
    await buildVariant({
      sourcePath,
      slug: image.slug,
      cropPosition: image.cropPosition,
      aspectRatio: image.aspectRatio,
      width,
      format: { extension: "jpg" },
    });
  }
}

await enforceBudgets();
