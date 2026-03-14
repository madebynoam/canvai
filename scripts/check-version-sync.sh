#!/usr/bin/env bash
#
# Pre-commit hook: verify all 6 version fields are in sync.
# Prevents commits where bump-version.sh was forgotten.
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# Extract versions from all sources
V1=$(node -p "require('$ROOT/package.json').version")
V2=$(node -p "JSON.parse(require('fs').readFileSync('$ROOT/plugin/.claude-plugin/marketplace.json','utf-8')).metadata.version")
V3=$(node -p "JSON.parse(require('fs').readFileSync('$ROOT/plugin/.claude-plugin/marketplace.json','utf-8')).plugins[0].version")
V4=$(node -p "JSON.parse(require('fs').readFileSync('$ROOT/plugin/plugins/bryllen/.claude-plugin/plugin.json','utf-8')).version")
V5=$(node -p "JSON.parse(require('fs').readFileSync('$ROOT/.claude-plugin/marketplace.json','utf-8')).metadata.version")
V6=$(node -p "JSON.parse(require('fs').readFileSync('$ROOT/.claude-plugin/marketplace.json','utf-8')).plugins[0].version")

if [ "$V1" != "$V2" ] || [ "$V1" != "$V3" ] || [ "$V1" != "$V4" ] || [ "$V1" != "$V5" ] || [ "$V1" != "$V6" ]; then
  echo ""
  echo "ERROR: Version fields are out of sync!"
  echo ""
  echo "  package.json:                          $V1"
  echo "  plugin marketplace metadata.version:   $V2"
  echo "  plugin marketplace plugin version:     $V3"
  echo "  plugin.json:                           $V4"
  echo "  root marketplace metadata.version:     $V5"
  echo "  root marketplace plugin version:       $V6"
  echo ""
  echo "Run: ./scripts/bump-version.sh <version>"
  exit 1
fi
