# CI/CD Strategy

Three workflows, one shared definition of "green", and one rule per pipeline
about when it is allowed to run.

| Workflow                | Trigger                                | Answers                        |
| ----------------------- | -------------------------------------- | ------------------------------ |
| `checks.yml`            | every pull request, every push to main | Is this code good?             |
| `non-prod-preview.yml`  | same-repo PR events, push to main      | What does this code look like? |
| `deploy-production.yml` | `v*` tags, manual rollback             | Is this release live?          |

`deploy-production.yml` calls `checks.yml` rather than restating it, so a
release is gated on exactly the checks a pull request was gated on.

## Why the previews are shaped this way

Azure Static Web Apps replaces the entire contents of an environment on every
deploy, and every preview has to live on one hostname because reviewer access is
a `reviewer` role assignment scoped to that hostname. Both constraints point at
the same design: the preview site is always published as one assembled tree.

```
/                     review index
/preview/             main branch
/preview/pr/<n>/      one open pull request
```

The old cost of that design was that assembling meant rebuilding every open pull
request on every event — with eight open Dependabot PRs, nine `npm ci` + `vite
build` cycles per push, in series, in one job. Any single failure took down every
preview, and two PR events at once produced two runs that raced to overwrite each
other's tree.

The fix separates _building a target_ from _publishing the site_.

```
plan ──▶ build (matrix, one job per stale target) ──▶ deploy (assemble + publish)
```

- **`plan`** lists every target (main plus each eligible open PR) and computes a
  stable artifact name from that target's own commit SHA.
- **`build`** runs only for targets whose artifact does not already exist. Each
  target is a plain `actions/checkout` of its own ref — no `git checkout --force`
  inside a shared working tree — so one pull request can no longer affect
  another's output. `fail-fast: false` means a broken PR fails alone.
- **`deploy`** downloads every target's artifact by name, assembles the tree,
  and publishes it.

A typical event now rebuilds exactly one target and reuses the rest.

### Invariants

- **One assembler at a time.** `concurrency: non-prod-preview` is repository-wide
  with `cancel-in-progress: false`. The published tree is the complete state of
  all open pull requests, so a queued run always supersedes an older queued run,
  while a run already uploading is never interrupted.
- **Never publish a site without main.** If the main target is missing, the
  deploy fails instead of publishing a review index with a broken root.
- **A failed target is omitted, not fatal.** Its status appears in the job
  summary; it just does not get a link on the index.
- **Bounded deploys.** The Static Web Apps CLI has hung against the deployment
  API. Each attempt is wrapped in `timeout 480` and retried up to three times,
  and every job has a `timeout-minutes`.
- **Diagnostics never gate deploys.** Coverage and Playwright report uploads are
  `continue-on-error` with run-unique names. A failed artifact upload previously
  skipped the deploy of `main` entirely.

### When previews do _not_ run

- **Fork pull requests.** They cannot reach the deployment secret and their build
  output is untrusted. `checks.yml` still runs for them.
- **Bot pull requests.** Dependabot opens up to ten PRs at once; a preview of a
  lockfile bump is rarely worth a build. Add the `preview` label to any bot PR
  that does need one.
- **Closed pull requests.** There is no separate cleanup workflow any more. A
  closed PR is simply no longer an open PR, so the next assembly leaves it out.
  Closing a PR and deploying a preview are the same code path.

## Production

Production releases on a `v*` tag and is deliberately conservative.

1. **`checks`** — the shared quality gate, on the tagged commit.
2. **`package`** — verify the tag matches `package.json`, build once, stamp
   `dist/build-id.txt` with `<tag> <sha>`, verify the generated SEO files, and
   upload the result. Every later job deploys _that_ artifact, so the bytes that
   passed checks are the bytes that ship.
3. **`deploy`** — upload to the inactive blue/green slot, verify the slot really
   holds this build, promote to the live web root, record the active slot, then
   confirm the live site serves this build id.
4. **`release`** — create the GitHub release. Split out so a release-API hiccup
   cannot make a healthy deploy look failed.

### Invariants

- **Never cancel production.** `cancel-in-progress: false`. Cancelling mid-mirror
  can leave the web root between two releases.
- **Publish in two passes.** The promote step mirrors additions and updates
  first, then prunes in a second pass. A visitor mid-deploy sees the old page or
  the new page, never a page whose assets have already been deleted.
- **A deploy is not done until the site says so.** `build-id.txt` is fetched back
  over HTTPS and compared. "The upload finished" is not the same claim as "the
  release is serving".
- **Failure after promotion rolls back automatically.** The previous slot is
  restored and the active-slot marker is put back, then the job fails loudly.
- **Fail before touching the network.** The `hostinger-session` composite action
  validates every required secret, prepares the SSH identity, and proves it can
  reach the web root before any transfer starts.

### Manual rollback

Unchanged: **Actions → Production Deploy → Run workflow**, `operation: rollback`.
Leave `rollback_slot` empty to flip to the opposite of the current active slot.
The rollback path now shares the same promote and slot helpers as the deploy
path, and verifies the site responds afterwards.

## Deliberate non-choices

- **No `paths-ignore` on the preview workflow.** It would let a docs-only merge
  leave the published tree stale. Now that a normal run rebuilds one target,
  running it every time is cheap enough to prefer correctness.
- **Previews are not gated on the full check suite.** Each target build runs
  `typecheck` before building, which is what actually protects the assembled
  tree. Unit and smoke tests run in parallel in `checks.yml`; blocking previews
  on them is what caused a failed artifact upload to skip a deployment. A preview
  of imperfect code is usually the point of a preview.

## Operational knobs

| Knob                           | Where                                  | Use                                                       |
| ------------------------------ | -------------------------------------- | --------------------------------------------------------- |
| `PREVIEW_CACHE_VERSION`        | `non-prod-preview.yml` `env`           | Bump to invalidate every cached preview build             |
| `cache_bust` input             | Run workflow → Non-Prod Preview Deploy | Force a one-off full rebuild                              |
| `preview` label                | any bot pull request                   | Opt that PR into a preview                                |
| `PROD_SITE_URL` variable       | `prod` environment                     | Enables post-deploy verification (skipped with a warning) |
| `HOSTINGER_KNOWN_HOSTS` secret | `prod` environment                     | Enables strict host key checking (warns when unset)       |
| Required reviewers on `prod`   | GitHub environment settings            | Pause releases and rollbacks for approval                 |
