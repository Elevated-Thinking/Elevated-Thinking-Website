#!/usr/bin/env bash
#
# Publishes a local directory to the live Hostinger web root.
#
# The mirror runs in two passes on purpose. The first pass only adds and
# updates, so every asset the new HTML references exists before any old file is
# removed; the second pass prunes what the release no longer ships. A visitor
# during the window sees the old or the new page, never a page with missing
# assets.
set -euo pipefail

source_dir="${1:?usage: hostinger-promote.sh <local-directory>}"

: "${LFTP_RUN:?hostinger-session action must run first}"
: "${HOSTINGER_REMOTE_ROOT:?hostinger-session action must run first}"

if [ ! -f "$source_dir/index.html" ]; then
  echo "::error::$source_dir does not look like a built site (missing index.html)."
  exit 1
fi

echo "Publishing $source_dir to $HOSTINGER_REMOTE_ROOT (pass 1 of 2: add and update)"
"$LFTP_RUN" <<EOF
mirror --reverse --verbose --exclude-glob .deploy-slots/ "$source_dir" "$HOSTINGER_REMOTE_ROOT"
EOF

echo "Publishing $source_dir to $HOSTINGER_REMOTE_ROOT (pass 2 of 2: prune)"
"$LFTP_RUN" <<EOF
mirror --reverse --delete --verbose --exclude-glob .deploy-slots/ "$source_dir" "$HOSTINGER_REMOTE_ROOT"
EOF

echo "Published $source_dir to $HOSTINGER_REMOTE_ROOT."
