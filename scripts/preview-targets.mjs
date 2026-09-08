/**
 * Resolves every preview target for a non-prod preview deployment.
 *
 * A "target" is one independently buildable site: the main branch preview plus
 * one entry per eligible open pull request. Each target carries a stable
 * artifact name derived from its commit SHA, so a target only has to be rebuilt
 * when its own code changes.
 */
const ensureTrailingSlash = (value) =>
  value.endsWith("/") ? value : `${value}/`;

const normalizePathBase = (value) =>
  ensureTrailingSlash(value.startsWith("/") ? value : `/${value}`);

export const resolvePreviewTargets = ({
  botAuthors = [],
  botPreviewLabel = "preview",
  cacheVersion = "v1",
  mainBranch = "main",
  mainPreviewPath = "/preview/",
  mainSha = "",
  previewOrigin = "",
  prPreviewPathBase = "/preview/pr/",
  pullRequests = [],
  repository = "",
}) => {
  const shortSha = (sha) => String(sha).slice(0, 12);
  const origin = previewOrigin.replace(/\/+$/, "");
  const mainBase = normalizePathBase(mainPreviewPath);
  const prBase = normalizePathBase(prPreviewPathBase);
  const bots = new Set(botAuthors.map((author) => author.toLowerCase()));
  const label = botPreviewLabel.toLowerCase();

  const targets = [
    {
      id: "main",
      kind: "main",
      number: null,
      title: `${mainBranch} branch`,
      ref: mainSha || mainBranch,
      sha: mainSha,
      base: mainBase,
      url: `${origin}${mainBase}`,
      outPath: mainBase.replace(/^\/|\/$/g, ""),
      artifact: `preview-${cacheVersion}-main-${shortSha(mainSha)}`,
    },
  ];

  const skipped = [];
  const seen = new Set();

  for (const pullRequest of pullRequests) {
    const number = Number(pullRequest.number);

    if (!Number.isInteger(number) || number <= 0 || seen.has(number)) {
      continue;
    }
    seen.add(number);

    // Fork pull requests cannot reach deployment secrets, and their build output
    // is untrusted, so they never enter the shared preview host.
    if (
      repository &&
      pullRequest.headRepository &&
      pullRequest.headRepository.toLowerCase() !== repository.toLowerCase()
    ) {
      skipped.push({ number, reason: "fork" });
      continue;
    }

    // Dependency bots open many simultaneous pull requests. Building a preview
    // for each one is almost never useful, so they opt in with a label instead.
    const labels = (pullRequest.labels ?? []).map((entry) =>
      String(entry).toLowerCase()
    );

    if (
      bots.has(String(pullRequest.author ?? "").toLowerCase()) &&
      !labels.includes(label)
    ) {
      skipped.push({ number, reason: `bot author without "${label}" label` });
      continue;
    }

    const base = `${prBase}${number}/`;

    targets.push({
      id: `pr-${number}`,
      kind: "pr",
      number,
      title: pullRequest.title ?? `Pull request #${number}`,
      ref: `refs/pull/${number}/head`,
      sha: pullRequest.sha ?? "",
      base,
      url: `${origin}${base}`,
      outPath: base.replace(/^\/|\/$/g, ""),
      artifact: `preview-${cacheVersion}-pr-${number}-${shortSha(pullRequest.sha ?? "")}`,
    });
  }

  return { targets, skipped };
};
