#!/usr/bin/env bash
#
# Reads and writes the blue/green slot marker stored alongside the web root.
set -euo pipefail

: "${LFTP_RUN:?hostinger-session action must run first}"
: "${HOSTINGER_SLOTS_ROOT:?hostinger-session action must run first}"

command="${1:?usage: hostinger-slot.sh <read|write|fetch> [value]}"
marker=".active-slot"

case "$command" in
  read)
    tmp_dir="$(mktemp -d)"
    trap 'rm -rf "$tmp_dir"' EXIT

    if "$LFTP_RUN" >/dev/null 2>&1 <<EOF
get -O "$tmp_dir" "$HOSTINGER_SLOTS_ROOT/$marker"
EOF
    then
      slot="$(tr -d '[:space:]' < "$tmp_dir/$marker" || true)"
      if [ "$slot" = "blue" ] || [ "$slot" = "green" ]; then
        printf '%s' "$slot"
        exit 0
      fi
    fi

    # No usable marker yet. Reporting green as active makes the first deploy
    # land in blue, which matches a fresh blue/green rotation.
    printf 'green'
    ;;

  write)
    slot="${2:?usage: hostinger-slot.sh write <blue|green>}"
    tmp_dir="$(mktemp -d)"
    trap 'rm -rf "$tmp_dir"' EXIT

    printf '%s\n' "$slot" > "$tmp_dir/$marker"
    "$LFTP_RUN" <<EOF
mkdir -p -f "$HOSTINGER_SLOTS_ROOT"
put -O "$HOSTINGER_SLOTS_ROOT" "$tmp_dir/$marker"
EOF
    echo "Active slot marker set to $slot."
    ;;

  fetch)
    slot="${2:?usage: hostinger-slot.sh fetch <blue|green> <destination>}"
    destination="${3:?usage: hostinger-slot.sh fetch <blue|green> <destination>}"

    mkdir -p "$destination"
    "$LFTP_RUN" <<EOF
mirror --verbose "$HOSTINGER_SLOTS_ROOT/$slot" "$destination"
EOF

    if [ ! -f "$destination/index.html" ]; then
      echo "::error::Slot $slot does not contain a usable release (missing index.html)."
      exit 1
    fi
    ;;

  *)
    echo "::error::Unknown command: $command"
    exit 1
    ;;
esac
