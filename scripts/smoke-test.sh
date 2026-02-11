#!/usr/bin/env bash
#
# Smoke test: scaffold a fresh consumer project and verify it typechecks.
# Simulates what a real consumer does: npm install canvai, canvai init, tsc.
#
set -euo pipefail

CANVAI_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TMPDIR_BASE="${TMPDIR:-/tmp}"
WORKDIR="$(mktemp -d "${TMPDIR_BASE}canvai-smoke-XXXXXX")"

cleanup() { rm -rf "$WORKDIR"; }
trap cleanup EXIT

echo "==> Smoke test: scaffolding in $WORKDIR"

cd "$WORKDIR"

# Initialize a minimal package.json
npm init -y --silent >/dev/null 2>&1

# Install local canvai (simulates github:madebynoam/canvai)
echo "==> Installing canvai from local path..."
npm install "$CANVAI_ROOT" --silent 2>&1 | tail -1

# Run canvai init
echo "==> Running canvai init..."
npx canvai init 2>&1

# Verify expected files exist
echo "==> Verifying scaffolded files..."
EXPECTED_FILES=(
  "index.html"
  "vite.config.ts"
  "tsconfig.json"
  "tsconfig.app.json"
  "tsconfig.node.json"
  "src/main.tsx"
  "src/App.tsx"
  "src/index.css"
  "src/vite-env.d.ts"
  ".canvai"
)

MISSING=0
for f in "${EXPECTED_FILES[@]}"; do
  if [ ! -f "$f" ]; then
    echo "  MISSING: $f"
    MISSING=$((MISSING + 1))
  fi
done

if [ "$MISSING" -gt 0 ]; then
  echo "FAIL: $MISSING expected file(s) missing"
  exit 1
fi
echo "  All expected files present."

# Verify .canvai has a version
echo "==> Checking .canvai version marker..."
if ! node -e "const d = JSON.parse(require('fs').readFileSync('.canvai','utf-8')); if(!d.version) process.exit(1)"; then
  echo "FAIL: .canvai is missing or has no version"
  exit 1
fi
echo "  .canvai version marker OK."

# Typecheck
echo "==> Running tsc --noEmit..."
npx tsc --noEmit 2>&1

echo ""
echo "==> Smoke test PASSED"
