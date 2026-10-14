#!/usr/bin/env bash
# Uploads the iOS build and prepares version 1.0.0 in App Store Connect, ready for review.
# Does NOT submit for review; that is the last command printed at the end.
# Needs: `asc auth` (API key) and a live `asc web auth login` session.
set -euo pipefail
cd "$(dirname "$0")/.."

APP=6822876028
VERSION=1.0.0
IPA=.asc/artifacts/Gita.ipa

read -rp "App Review contact first name: " FIRST
read -rp "App Review contact last name: " LAST
read -rp "App Review contact phone (e.g. +91 98765 43210): " PHONE
read -rp "App Review contact email: " EMAIL

step() { printf '\n\033[1;33m== %s\033[0m\n' "$1"; }

step "Upload build, create version $VERSION, apply listing text, attach build"
asc publish appstore --app "$APP" --ipa "$IPA" --version "$VERSION" --metadata-dir ./metadata --wait --timeout 40m --output table

VERSION_ID=$(asc versions list --app "$APP" --version "$VERSION" --platform IOS --output json | python3 -c 'import sys,json; print(json.load(sys.stdin)["data"][0]["id"])')
echo "Version ID: $VERSION_ID"

step "App info: subtitle and privacy policy URL"
asc metadata push --app "$APP" --version "$VERSION" --dir ./metadata --output table || echo "(app-info push skipped; set subtitle in App Store Connect if missing)"

step "Screenshots (6.9-inch iPhone)"
asc screenshots upload --app "$APP" --version "$VERSION" --locale en-US --path ./metadata/screenshots/en-US --device-type IPHONE_69 --skip-existing --output table

step "Category: Books (primary), Lifestyle (secondary)"
asc app-setup categories set --app "$APP" --primary BOOKS --secondary LIFESTYLE --output table

step "Price: Free, available everywhere"
asc app-setup pricing set --app "$APP" --free --base-territory USA --output table
asc app-setup availability edit --app "$APP" --all-territories --available true --output table

step "Age rating: no objectionable content (4+)"
asc age-rating edit --app "$APP" --all-none --output table

step "App privacy: Data Not Collected"
asc web privacy publish --app "$APP" --confirm --output table

step "App Review contact and notes"
asc review details-create --version-id "$VERSION_ID" --if-exists update \
  --contact-first-name "$FIRST" --contact-last-name "$LAST" --contact-phone "$PHONE" --contact-email "$EMAIL" \
  --notes "Gita is a free reading and learning app for the Bhagavad Gita (all 18 chapters, 701 verses) with 140 short daily lessons. No account, login or purchases: every feature is open on first launch. All verse and lesson content is bundled, so the app works fully offline. Native features: daily lesson reminders (local notifications, opt-in during onboarding), haptic feedback, the iOS share sheet for verses, and gita://verse/2/47 deep links. Progress is stored only on the device. To try a lesson: tap Begin the journey, pick any options, then press and hold the lamp." \
  --output table

step "Readiness check"
asc validate --app "$APP" --version "$VERSION" --platform IOS --output table

printf '\nAll set. When you are happy with it, submit for review with:\n  asc review submit --app %s --version %s --confirm\n' "$APP" "$VERSION"
