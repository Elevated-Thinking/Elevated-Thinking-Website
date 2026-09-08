import { readFileSync } from "node:fs";
import { join } from "node:path";

const read = (path: string) => readFileSync(join(process.cwd(), path), "utf8");

describe("production workflow", () => {
  const workflow = read(".github/workflows/deploy-production.yml");

  it("gates a release on the same Checks workflow pull requests run", () => {
    expect(workflow).toContain("uses: ./.github/workflows/checks.yml");
    expect(workflow).toContain("needs: checks");
  });

  it("never cancels a production run in flight", () => {
    expect(workflow).toContain("group: production");
    expect(workflow).toContain("cancel-in-progress: false");
  });

  it("verifies generated SEO files before uploading the production artifact", () => {
    const verifyStep = "- name: Verify generated SEO files";
    const uploadStep = "- name: Upload production artifact";

    expect(workflow).toContain(verifyStep);
    expect(workflow).toContain("test -f dist/sitemap.xml");
    expect(workflow).toContain("test -f dist/robots.txt");
    expect(workflow).toContain('grep -F "User-agent: *" dist/robots.txt');
    expect(workflow).toContain('grep -F "Allow: /" dist/robots.txt');
    expect(workflow).toContain(
      'grep -F "Sitemap: https://www.elevatedthinking.co/sitemap.xml" dist/robots.txt'
    );
    expect(workflow).toContain(
      'grep -F "https://www.elevatedthinking.co/" dist/sitemap.xml'
    );
    expect(workflow.indexOf(verifyStep)).toBeLessThan(
      workflow.indexOf(uploadStep)
    );
  });

  it("stamps a build id and checks the live site serves it", () => {
    expect(workflow).toContain("dist/build-id.txt");
    expect(workflow).toContain(
      "- name: Verify the live site serves this release"
    );
    expect(workflow).toContain(
      "Live site never reported build '$EXPECTED_BUILD_ID'"
    );
  });

  it("verifies the uploaded slot before promoting it to the live web root", () => {
    expect(workflow.indexOf("- name: Verify the uploaded slot")).toBeLessThan(
      workflow.indexOf("- name: Promote the release to the live web root")
    );
  });

  it("rolls back automatically when a promoted release fails verification", () => {
    expect(workflow).toContain("- name: Roll back to the previous slot");
    expect(workflow).toContain(
      "if: failure() && env.PROMOTION_STARTED == 'true'"
    );
  });

  it("deploys the artifact that passed checks rather than rebuilding", () => {
    expect(workflow).toContain("uses: actions/download-artifact@v8.0.1");
    expect(workflow).toContain("name: ${{ needs.package.outputs.artifact }}");
  });

  it("gives every job that claims a runner a timeout", () => {
    const runners = workflow.match(/^ {4}runs-on:/gm) ?? [];
    const timeouts = workflow.match(/^ {4}timeout-minutes:/gm) ?? [];

    expect(runners.length).toBeGreaterThan(0);
    expect(timeouts.length).toBe(runners.length);
  });
});

describe("hostinger deploy helpers", () => {
  it("publishes in two passes so the live site is never missing assets", () => {
    const promote = read("scripts/deploy/hostinger-promote.sh");

    expect(promote).toContain(
      "mirror --reverse --verbose --exclude-glob .deploy-slots/"
    );
    expect(promote).toContain(
      "mirror --reverse --delete --verbose --exclude-glob .deploy-slots/"
    );
    expect(promote.indexOf("pass 1 of 2")).toBeLessThan(
      promote.indexOf("pass 2 of 2")
    );
  });

  it("validates every required Hostinger secret before connecting", () => {
    const action = read(".github/actions/hostinger-session/action.yml");

    expect(action).toContain(
      "for required in HOSTINGER_HOST HOSTINGER_USERNAME HOSTINGER_REMOTE_PATH HOSTINGER_SSH_PRIVATE_KEY"
    );
    expect(action).toContain("Missing required Hostinger secrets");
  });
});
