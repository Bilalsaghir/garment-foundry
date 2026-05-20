#!/usr/bin/env bash
# ============================================================
# Garment Foundry — VPS deploy script
# Run this on the Hostinger VPS as a user that owns /var/www/garmentfoundry
# and has sudo for the nginx reload.
#
# Usage:
#   ./deploy.sh                # pull main, build, reload nginx
#   ./deploy.sh --skip-pull    # just rebuild from current working copy
#   ./deploy.sh --no-reload    # skip nginx reload (e.g. you'll do it yourself)
# ============================================================

set -euo pipefail

# --- config ---------------------------------------------------------------
REPO_DIR="${REPO_DIR:-/var/www/garmentfoundry}"
BRANCH="${BRANCH:-main}"
FRONTEND_DIR="$REPO_DIR/frontend"
NGINX_RELOAD="${NGINX_RELOAD:-yes}"
DO_PULL="${DO_PULL:-yes}"

# --- arg parsing ----------------------------------------------------------
for arg in "$@"; do
  case "$arg" in
    --skip-pull) DO_PULL="no" ;;
    --no-reload) NGINX_RELOAD="no" ;;
    -h|--help)
      sed -n '2,16p' "$0"; exit 0 ;;
  esac
done

ts() { date +"%H:%M:%S"; }
log() { printf "\033[1;36m[%s]\033[0m %s\n" "$(ts)" "$*"; }

# --- 1. pull ---------------------------------------------------------------
if [[ "$DO_PULL" == "yes" ]]; then
  log "Pulling $BRANCH into $REPO_DIR ..."
  cd "$REPO_DIR"
  git fetch --depth=1 origin "$BRANCH"
  git reset --hard "origin/$BRANCH"
  git clean -fd
else
  log "Skipping git pull (--skip-pull)"
  cd "$REPO_DIR"
fi

# --- 2. install + build ----------------------------------------------------
log "Installing dependencies (legacy peer deps — react-day-picker / date-fns)"
cd "$FRONTEND_DIR"
# Use ci where the lockfile is clean, otherwise fall back to install.
if [[ -f package-lock.json ]] && npm ci --legacy-peer-deps --no-audit --no-fund --progress=false 2>/dev/null; then
  log "  npm ci succeeded"
else
  npm install --legacy-peer-deps --no-audit --no-fund --progress=false
fi

log "Building production bundle ..."
DISABLE_ESLINT_PLUGIN=true npm run build

# --- 3. reload nginx -------------------------------------------------------
if [[ "$NGINX_RELOAD" == "yes" ]]; then
  log "Validating + reloading nginx ..."
  sudo nginx -t && sudo systemctl reload nginx
fi

# --- 4. summary ------------------------------------------------------------
log "Deploy complete."
log "  Build output:  $FRONTEND_DIR/build"
log "  Bundle hash:   $(grep -oE 'main\.[a-f0-9]+\.js' "$FRONTEND_DIR/build/index.html" || echo 'unknown')"
