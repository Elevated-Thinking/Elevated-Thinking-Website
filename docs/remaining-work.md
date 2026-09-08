# Remaining Work

The repository now uses Azure Static Web Apps for non-production preview hosting and Hostinger for production.

## Applied Repository Direction

- GitHub Pages preview hosting is retired.
- The old `gh-pages` branch should be deleted after GitHub Pages is disabled.
- Non-production preview deployments target:
  - Resource group: `rg-elevated-thinking-preview`
  - Static Web App: `elevated-thinking-preview-swa`
  - GitHub environment: `non-prod-preview`
- Production deployments still target the `prod` environment and Hostinger SFTP.

## 1. Confirm Non-Prod Preview Access

After the Azure Static Web App and GitHub secret are configured:

1. Open or update a same-repository pull request.
2. Confirm `validate`, `unit_tests`, and `smoke_tests` pass.
3. Confirm `Non-Prod Preview Deploy` publishes a preview URL under `/preview/pr/<number>/`.
4. Open the root review index in a private browser window and confirm it redirects to GitHub login.
5. Sign in with an invited GitHub account and confirm the review index loads.
6. Confirm the review index links to the latest main preview at `/preview/`.
7. Confirm the review index links to open pull request preview URLs under `/preview/pr/<number>/`.
8. Sign in with an uninvited GitHub account and confirm access is denied.

## 2. Add Preview Reviewers

Invite approved GitHub reviewers to the `reviewer` role:

```bash
az staticwebapp users invite \
  --name elevated-thinking-preview-swa \
  --resource-group rg-elevated-thinking-preview \
  --authentication-provider GitHub \
  --user-details <github-login> \
  --roles reviewer \
  --domain <default-static-web-app-hostname> \
  --invitation-expiration-in-hours 168
```

## 3. Add the Hostinger Production Secrets

Add these exact secret names to the GitHub `prod` environment:

- `HOSTINGER_HOST`
- `HOSTINGER_USERNAME`
- `HOSTINGER_SSH_PRIVATE_KEY`
- `HOSTINGER_REMOTE_PATH`
- `HOSTINGER_PORT`

Optional, but recommended for stricter SSH host verification:

- `HOSTINGER_KNOWN_HOSTS`

Recommended `HOSTINGER_REMOTE_PATH` for this setup: `public_html/`.

## 4. Confirm the Hostinger Values Before the First Prod Deploy

Verify all of these with Hostinger:

- The correct SFTP host for `HOSTINGER_HOST`
- The correct SFTP username for `HOSTINGER_USERNAME`
- The private deploy key in `HOSTINGER_SSH_PRIVATE_KEY` matches a public key authorized in Hostinger
- The correct document root for `HOSTINGER_REMOTE_PATH`
- Whether SFTP is enabled on the account
- The exact SSH/SFTP port shown in Hostinger hPanel for `HOSTINGER_PORT`
- Optional `HOSTINGER_KNOWN_HOSTS` contains the output of `ssh-keyscan -p <port> <host>`

The production workflow uses `lftp mirror --reverse --delete`, so `HOSTINGER_REMOTE_PATH` must point at the real production web root.

## 5. Optionally Add the Production Site URL Variable

If you want the GitHub `prod` environment to show a clickable deployment URL, add this environment variable on `prod`:

- `PROD_SITE_URL`
  - Example: `https://elevatedthinking.co/`

## 6. Run the First Production Deployment

After the `prod` secrets are added:

1. Merge an approved pull request into `main`.
2. Cut and push a release tag with `npm version patch` and `git push --follow-tags`.
3. Approve the pending `prod` deployment when GitHub pauses it for environment review.
4. Confirm the `Production Deploy` workflow succeeds.
5. Confirm the site is uploaded to Hostinger successfully.
6. Confirm a GitHub release is created for the version tag.
7. Open the production domain and verify the live site.

Also verify:

- `index.html` exists in the Hostinger web root.
- `assets/` exists in the Hostinger web root.
- Old asset files are removed on later deploys.

## 7. Optional Future Enhancements

These are not required for the current pipeline:

- Support preview deployments for forked pull requests with a safer external approval flow.
- Require pinned Hostinger SSH host keys by making `HOSTINGER_KNOWN_HOSTS` mandatory.
- Add a custom preview domain for Azure Static Web Apps.
