#!/usr/bin/env bash
#
# Bump the canvai version across all 5 fields in 4 files.
#
# Usage: ./scripts/bump-version.sh <version>
# Example: ./scripts/bump-version.sh 0.0.15
#
set -euo pipefail

if [ $# -ne 1 ]; then
  echo "Usage: $0 <version>"
  echo "Example: $0 0.0.15"
  exit 1
fi

VERSION="$1"

# Validate semver-ish format
if ! echo "$VERSION" | grep -qE '^[0-9]+\.[0-9]+\.[0-9]+$'; then
  echo "Error: version must be in X.Y.Z format (got: $VERSION)"
  exit 1
fi

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "Bumping to $VERSION..."

# 1. package.json → version
node -e "
  const fs = require('fs');
  const path = '$ROOT/package.json';
  const pkg = JSON.parse(fs.readFileSync(path, 'utf-8'));
  pkg.version = '$VERSION';
  fs.writeFileSync(path, JSON.stringify(pkg, null, 2) + '\n');
"
echo "  1/4 package.json"

# 2. plugin/.claude-plugin/marketplace.json → metadata.version + plugins[0].version
node -e "
  const fs = require('fs');
  const path = '$ROOT/plugin/.claude-plugin/marketplace.json';
  const data = JSON.parse(fs.readFileSync(path, 'utf-8'));
  data.metadata.version = '$VERSION';
  data.plugins[0].version = '$VERSION';
  fs.writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
"
echo "  2/4 plugin/.claude-plugin/marketplace.json"

# 3. plugin/plugins/canvai/.claude-plugin/plugin.json → version
node -e "
  const fs = require('fs');
  const path = '$ROOT/plugin/plugins/canvai/.claude-plugin/plugin.json';
  const data = JSON.parse(fs.readFileSync(path, 'utf-8'));
  data.version = '$VERSION';
  fs.writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
"
echo "  3/4 plugin/plugins/canvai/.claude-plugin/plugin.json"

# 4. .claude-plugin/marketplace.json → metadata.version + plugins[0].version
node -e "
  const fs = require('fs');
  const path = '$ROOT/.claude-plugin/marketplace.json';
  const data = JSON.parse(fs.readFileSync(path, 'utf-8'));
  data.metadata.version = '$VERSION';
  data.plugins[0].version = '$VERSION';
  fs.writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
"
echo "  4/4 .claude-plugin/marketplace.json"

echo ""
echo "All 5 version fields bumped to $VERSION"
