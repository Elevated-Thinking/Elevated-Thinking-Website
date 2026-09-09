import { readFileSync } from "node:fs";
import { join } from "node:path";

const read = (path: string) => readFileSync(join(process.cwd(), path), "utf8");

describe("non-prod preview workflow", () => {
  const workflow = read(".github/workflows/non-prod-preview.yml");

  it("serializes preview deploys repository-wide without cancelling one in flight", () => {
    expect(workflow).toContain("group: non-prod-preview");
    expect(workflow).toContain("cancel-in-progress: false");
  });

  it("never runs the deployment pipeline for fork pull requests", () => {
    expect(workflow).toContain(
      "github.event.pull_request.head.repo.full_name == github.repository"
    );
  });

  it("isolates target builds so one failure cannot break other previews", () => {
    expect(workflow).toContain("fail-fast: false");
    expect(workflow).toContain(
      "matrix:\n        target: ${{ fromJSON(needs.plan.outputs.build_matrix) }}"
    );
    expect(workflow).toContain(
      "if: always() && needs.plan.result == 'success'"
    );
  });

  it("refuses to publish a preview site without the main preview", () => {
    expect(workflow).toContain("- name: Fail if the main preview is missing");
  });

  it("bounds and retries the Static Web Apps deployment instead of hanging", () => {
    expect(workflow).toContain("timeout 480 npx -y @azure/static-web-apps-cli");
    expect(workflow).toContain(
      "Static Web Apps deployment failed after 3 attempts"
    );
  });

  it("never writes an npm cache from the job that runs pull request code", () => {
    const buildJob = workflow
      .slice(workflow.indexOf("  build:"), workflow.indexOf("  deploy:"))
      .split("\n")
      .filter((line) => !line.trim().startsWith("#"))
      .join("\n");

    expect(buildJob).toContain("ref: ${{ matrix.target.ref }}");
    expect(buildJob).not.toMatch(/^\s*cache:\s*npm\s*$/m);
  });

  it("carries dotfiles through preview artifacts", () => {
    expect(workflow).toContain("include-hidden-files: true");
  });

  it("gives every job that claims a runner a timeout", () => {
    const runners = workflow.match(/^ {4}runs-on:/gm) ?? [];
    const timeouts = workflow.match(/^ {4}timeout-minutes:/gm) ?? [];

    expect(runners.length).toBeGreaterThan(0);
    expect(timeouts.length).toBe(runners.length);
  });

  it("comments once with the PR preview URL after a successful PR deployment", () => {
    expect(workflow).toContain("issues: write");
    expect(workflow).toContain("- name: Comment with PR preview link");
    expect(workflow).toContain("<!-- elevated-thinking-pr-preview -->");
    expect(workflow).toContain("github.rest.issues.listComments");
    expect(workflow).toContain("github.rest.issues.createComment");
  });

  it("rewrites preview share metadata to the deployed preview URL", () => {
    const buildScript = read("scripts/build-preview-target.mjs");

    expect(buildScript).toContain("rewritePreviewMetadata");
    expect(buildScript).toContain("PREVIEW_URL");
    expect(workflow).toContain("PREVIEW_URL: ${{ matrix.target.url }}");
  });
});
