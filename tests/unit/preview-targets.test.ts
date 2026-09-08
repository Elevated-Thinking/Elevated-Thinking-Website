import { resolvePreviewTargets } from "../../scripts/preview-targets.mjs";

const baseOptions = {
  botAuthors: ["dependabot[bot]"],
  botPreviewLabel: "preview",
  cacheVersion: "v1",
  mainSha: "a".repeat(40),
  previewOrigin: "https://preview.example.net",
  repository: "eslutz/Elevated-Thinking-Website",
};

describe("preview targets", () => {
  it("always includes a main target served from /preview/", () => {
    const { targets } = resolvePreviewTargets({ ...baseOptions });

    expect(targets).toHaveLength(1);
    expect(targets[0]).toMatchObject({
      id: "main",
      kind: "main",
      base: "/preview/",
      url: "https://preview.example.net/preview/",
      outPath: "preview",
    });
  });

  it("keys each artifact on the target's own commit so unchanged targets are reused", () => {
    const pullRequest = {
      number: 7,
      title: "Add case study",
      sha: "b".repeat(40),
      author: "eslutz",
      headRepository: "eslutz/Elevated-Thinking-Website",
      labels: [],
    };

    const first = resolvePreviewTargets({
      ...baseOptions,
      pullRequests: [pullRequest],
    });
    const unchanged = resolvePreviewTargets({
      ...baseOptions,
      pullRequests: [{ ...pullRequest, title: "Renamed title" }],
    });
    const moved = resolvePreviewTargets({
      ...baseOptions,
      pullRequests: [{ ...pullRequest, sha: "c".repeat(40) }],
    });

    expect(first.targets[1].artifact).toBe("preview-v1-pr-7-bbbbbbbbbbbb");
    expect(unchanged.targets[1].artifact).toBe(first.targets[1].artifact);
    expect(moved.targets[1].artifact).not.toBe(first.targets[1].artifact);
  });

  it("builds each pull request from its own head ref under its own path", () => {
    const { targets } = resolvePreviewTargets({
      ...baseOptions,
      pullRequests: [
        {
          number: 42,
          title: "Bump things",
          sha: "d".repeat(40),
          author: "eslutz",
          headRepository: "eslutz/Elevated-Thinking-Website",
          labels: [],
        },
      ],
    });

    expect(targets[1]).toMatchObject({
      id: "pr-42",
      kind: "pr",
      number: 42,
      ref: "refs/pull/42/head",
      base: "/preview/pr/42/",
      url: "https://preview.example.net/preview/pr/42/",
      outPath: "preview/pr/42",
    });
  });

  it("excludes fork pull requests, which cannot reach deployment secrets", () => {
    const { targets, skipped } = resolvePreviewTargets({
      ...baseOptions,
      pullRequests: [
        {
          number: 9,
          title: "Drive-by fix",
          sha: "e".repeat(40),
          author: "outsider",
          headRepository: "outsider/Elevated-Thinking-Website",
          labels: [],
        },
      ],
    });

    expect(targets).toHaveLength(1);
    expect(skipped).toEqual([{ number: 9, reason: "fork" }]);
  });

  it("skips bot pull requests unless they opt in with the preview label", () => {
    const bot = {
      number: 40,
      title: "Bump ws",
      sha: "f".repeat(40),
      author: "dependabot[bot]",
      headRepository: "eslutz/Elevated-Thinking-Website",
      labels: [],
    };

    const withoutLabel = resolvePreviewTargets({
      ...baseOptions,
      pullRequests: [bot],
    });
    const withLabel = resolvePreviewTargets({
      ...baseOptions,
      pullRequests: [{ ...bot, labels: ["Preview"] }],
    });

    expect(withoutLabel.targets).toHaveLength(1);
    expect(withoutLabel.skipped[0].reason).toContain("bot author");
    expect(withLabel.targets).toHaveLength(2);
  });

  it("ignores duplicate pull request entries", () => {
    const pullRequest = {
      number: 11,
      title: "Duplicated",
      sha: "1".repeat(40),
      author: "eslutz",
      headRepository: "eslutz/Elevated-Thinking-Website",
      labels: [],
    };

    const { targets } = resolvePreviewTargets({
      ...baseOptions,
      pullRequests: [pullRequest, pullRequest],
    });

    expect(targets).toHaveLength(2);
  });
});
