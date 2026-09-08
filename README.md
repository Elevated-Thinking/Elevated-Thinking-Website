# Elevated Thinking Website

Static Vite + React + TypeScript site with Tailwind bundled through Vite.

## Requirements

- Node.js 24 or newer recommended
- npm

## Local Development

Install dependencies and start Vite:

```bash
npm install
npm run dev
```

Vite prints the local URL, usually `http://localhost:5173`.

Useful local checks:

```bash
npm run format:check
npm run typecheck
npm run test:unit
npm run test:smoke
```

Use `npm run format` to apply Prettier formatting. Smoke tests use Playwright Chromium; if the browser runtime is missing locally, run:

```bash
npx playwright install --with-deps chromium
```

Formatting is enforced before commit with `.githooks/pre-commit`. `npm install` runs `prepare`, which configures Git to use that hooks directory.

### Preview The Production Build Locally

This only builds and serves the production bundle on your machine. It does not deploy to production.

```bash
npm run build
npm run preview
```

The production bundle is written to `dist/`.

## CI/CD Overview

Three workflows, each answering one question. See [docs/ci-cd-strategy.md](docs/ci-cd-strategy.md) for the design and its invariants.

| Workflow                | File                                      | Runs on                                             |
| ----------------------- | ----------------------------------------- | --------------------------------------------------- |
| Checks                  | `.github/workflows/checks.yml`            | Every pull request and every push to `main`         |
| Non-Prod Preview Deploy | `.github/workflows/non-prod-preview.yml`  | Same-repository pull request events, push to `main` |
| Production Deploy       | `.github/workflows/deploy-production.yml` | `v*` tags, and manual rollback                      |

`Checks` is the single definition of "green":

- `validate` runs formatting and TypeScript checks.
- `unit_tests` runs Jest with coverage. The project enforces a 60% global coverage threshold.
- `smoke_tests` builds the site, serves the production bundle locally, runs Playwright Chromium smoke tests, and includes the axe accessibility scan.

`Production Deploy` calls the same workflow, so a release is gated on exactly the checks a pull request was gated on.

Preview deployment rules:

- Each preview target (`main`, plus each eligible open pull request) is built once per commit in its own job and cached as an artifact. A normal event rebuilds only the target that changed.
- One pull request failing to build no longer affects any other preview; it is simply left off the review index.
- Fork pull requests run checks but never enter the preview pipeline, because they cannot access deployment secrets.
- Dependency-bot pull requests are skipped by default. Add the `preview` label to a bot pull request to give it a preview.
- Closing a pull request needs no separate workflow: the closed pull request is no longer open, so the next assembly leaves it out.

## GitHub Environments

The repository uses two GitHub environments.

### `non-prod-preview`

Used by the non-production preview workflow for the review index, latest main preview, pull request previews, and PR preview cleanup.

Required secret:

| Name                                              | Used for                                                         | Value                                                                          |
| ------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `AZURE_STATIC_WEB_APPS_API_TOKEN_NONPROD_PREVIEW` | Deploying and closing Azure Static Web Apps preview environments | Deployment token from the `elevated-thinking-preview-swa` Azure Static Web App |

The Azure Static Web Apps resource is:

- Resource group: `rg-elevated-thinking-preview`
- Static Web App: `elevated-thinking-preview-swa`
- Region: `eastus2`

### `prod`

Used by the production deploy and rollback jobs. Configure required reviewers here if production releases or rollbacks should wait for manual approval before the workflow can access production secrets.

Required secrets:

| Name                        | Used for                    | Recommended value                                 |
| --------------------------- | --------------------------- | ------------------------------------------------- |
| `HOSTINGER_HOST`            | SSH/SFTP host               | Hostinger SSH/SFTP hostname                       |
| `HOSTINGER_PORT`            | SSH/SFTP port               | Exact SSH/SFTP port shown in Hostinger hPanel     |
| `HOSTINGER_USERNAME`        | SSH/SFTP username           | Hostinger SSH/SFTP username                       |
| `HOSTINGER_SSH_PRIVATE_KEY` | SSH private key for deploys | Private key matching a public key added to hPanel |
| `HOSTINGER_REMOTE_PATH`     | Production web root         | `public_html/`                                    |

Optional secret:

| Name                    | Used for                  | Recommended value                     |
| ----------------------- | ------------------------- | ------------------------------------- |
| `HOSTINGER_KNOWN_HOSTS` | SSH host key verification | `ssh-keyscan -p <port> <host>` output |

Recommended variable:

| Name            | Used for                                                              | Value                      |
| --------------- | --------------------------------------------------------------------- | -------------------------- |
| `PROD_SITE_URL` | GitHub deployment URL, and post-deploy verification of the live build | Public production site URL |

`GITHUB_TOKEN` is provided automatically by GitHub Actions and does not need to be configured.

## Preview Deployments

Preview sites are protected by Azure Static Web Apps authentication. Users sign in with GitHub and must have the `reviewer` role to access preview routes.

- Review index: `https://delightful-plant-05da2520f.7.azurestaticapps.net/`
- Latest main preview: `https://delightful-plant-05da2520f.7.azurestaticapps.net/preview/`
- Pull request previews: `https://delightful-plant-05da2520f.7.azurestaticapps.net/preview/pr/<number>/`

The review index links to the latest main preview and open same-repository pull request previews. Pull request previews are deployed under the protected review host so reviewers use the same GitHub sign-in and `reviewer` role assignment for every preview.

Azure Static Web Apps replaces the whole contents of an environment on every deploy, so the site is always published as one assembled tree rather than as independent per-pull-request deployments.

To force a full rebuild of every preview target, run **Actions -> Non-Prod Preview Deploy -> Run workflow** with `cache_bust` enabled, or bump `PREVIEW_CACHE_VERSION` in the workflow.

### Preview Deployment Access

To request access, ask a project administrator to invite your GitHub account to the Azure Static Web Apps `reviewer` role for `elevated-thinking-preview-swa`. Uninvited users can authenticate but will be denied access.

> [!NOTE]
> To grant access run this command with the GitHub username of the requestor.
>
> ```bash
> az staticwebapp users invite \
>   --name elevated-thinking-preview-swa \
>   --resource-group rg-elevated-thinking-preview \
>   --authentication-provider GitHub \
>   --user-details <github-username> \
>   --roles reviewer \
>   --domain delightful-plant-05da2520f.7.azurestaticapps.net \
>   --invitation-expiration-in-hours 36
> ```

## Production Deployment

Production deploys run when a release tag matching `v*` is pushed.

Recommended release flow:

```bash
npm version patch
git push --follow-tags
```

Use `patch`, `minor`, or `major` as appropriate. `npm version` updates `package.json` and `package-lock.json`, creates the release commit, and creates the matching tag. `git push --follow-tags` pushes the commit and tag, which starts the production workflow.

The workflow runs the shared `Checks` workflow on the tagged commit, verifies that the Git tag matches the package version, builds once, stamps `dist/build-id.txt` with `<tag> <sha>`, and uploads that build. Every later job deploys that artifact, so the bytes that passed checks are the bytes that ship.

The deploy then uploads the release to the inactive Hostinger blue/green slot over SFTP, verifies the slot really holds this build, promotes it to the live web root, records the new active slot, and fetches `build-id.txt` back over HTTPS to confirm the live site is serving this release. The GitHub release is created in a separate job so a release-API hiccup cannot make a healthy deploy look failed.

Two deliberate safety properties:

- The promotion mirrors additions and updates first and prunes in a second pass, so a visitor during a deploy sees the old page or the new page, never a page whose assets have already been deleted.
- If anything fails after promotion, the previous slot is restored automatically and the job then fails loudly.

If the `prod` environment has required reviewers, the deployment pauses for approval before accessing Hostinger secrets. Set the optional `PROD_SITE_URL` variable to enable post-deploy verification; without it the workflow warns and skips that check.

### Retry And Rollback

To retry a failed production deployment, open the failed `Production Deploy` run in GitHub Actions and choose **Re-run jobs**.

To roll back production:

1. Open **Actions -> Production Deploy**.
2. Choose **Run workflow**.
3. Set `operation` to `rollback`.
4. Leave `rollback_slot` empty for the workflow to automatically select the opposite of the current active slot.
5. Run the workflow.

Production keeps two remote slots at `HOSTINGER_REMOTE_PATH/.deploy-slots/blue` and `HOSTINGER_REMOTE_PATH/.deploy-slots/green`. The active slot is stored in `HOSTINGER_REMOTE_PATH/.deploy-slots/.active-slot`. A normal deployment writes the new release to the inactive slot, promotes it live, and marks that slot active.

For rollback, leaving `rollback_slot` empty is usually correct: the workflow reads `.active-slot` and rolls back to the other slot. Only set `rollback_slot=blue` or `rollback_slot=green` when you intentionally need a specific slot, such as after confirming the desired target from a previous workflow log or from the remote `.active-slot` marker.
