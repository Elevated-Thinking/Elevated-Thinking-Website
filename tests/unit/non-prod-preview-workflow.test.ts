import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("non-prod preview workflow", () => {
  const workflow = readFileSync(
    join(process.cwd(), ".github/workflows/non-prod-preview.yml"),
    "utf8"
  );
  const previewDeploymentScript = readFileSync(
    join(process.cwd(), "scripts/build-preview-deployment.mjs"),
    "utf8"
  );

  it("comments once with the PR preview URL after a successful PR deployment", () => {
    expect(workflow).toContain("issues: write");
    expect(workflow).toContain("- name: Comment with PR preview link");
    expect(workflow).toContain(
      "if: github.event_name == 'pull_request' && github.event.action != 'closed'"
    );
    expect(workflow).toContain("<!-- elevated-thinking-pr-preview -->");
    expect(workflow).toContain(
      "https://delightful-plant-05da2520f.7.azurestaticapps.net/preview/pr/${context.payload.pull_request.number}/"
    );
    expect(workflow).toContain("github.rest.issues.listComments");
    expect(workflow).toContain("github.rest.issues.createComment");
  });

  it("rewrites preview share metadata to deployed preview URLs", () => {
    expect(workflow).toContain("MAIN_PREVIEW_BASE_URL");
    expect(workflow).toContain(
      "PULL_REQUEST_PREVIEW_BASE_URL: https://delightful-plant-05da2520f.7.azurestaticapps.net/preview/pr/"
    );
    expect(previewDeploymentScript).toContain("rewritePreviewMetadata");
    expect(previewDeploymentScript).toContain("mainPreviewBaseUrl");
    expect(previewDeploymentScript).toContain("pullRequestPreviewBaseUrl");
  });
});
