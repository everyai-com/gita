#!/usr/bin/env bash
# Renders every app icon from metadata/app-icon.svg (headless Chrome + sips, macOS).
# Usage: scripts/build-icons.sh
set -euo pipefail
cd "$(dirname "$0")/.."

CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

printf '<html><body style="margin:0">%s</body></html>' "$(cat metadata/app-icon.svg)" > "$TMP/icon.html"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --window-size=1024,1024 \
  --screenshot="$TMP/icon.png" "file://$TMP/icon.html" 2>/dev/null

# App Store and iOS want an opaque PNG with no alpha.
sips -s format jpeg "$TMP/icon.png" --out "$TMP/icon.jpg" >/dev/null
sips -s format png "$TMP/icon.jpg" --out "$TMP/icon-1024.png" >/dev/null

size() { sips -z "$1" "$1" "$TMP/icon-1024.png" --out "$2" >/dev/null; echo "  $2 (${1}px)"; }
echo "Icons:"
size 1024 metadata/app-icon-1024.png
size 1024 ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png
size 512 public/icons/maskable-512.png
size 192 public/icons/pwa-192.png
size 180 public/icons/apple-touch-icon-180.png
size 32 public/icons/favicon-32.png
cp metadata/app-icon.svg public/brand/gita-icon.svg
