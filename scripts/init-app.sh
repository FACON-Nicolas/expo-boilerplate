#!/bin/bash

set -e

APP_JSON="app.json"

if [ ! -f "$APP_JSON" ]; then
  echo "Error: $APP_JSON not found. Run this script from the project root."
  exit 1
fi

if ! command -v jq &> /dev/null; then
  echo "Error: jq is required. Install it with: brew install jq"
  exit 1
fi

echo "╔════════════════════════════════════════╗"
echo "║       Expo App Initialization          ║"
echo "╚════════════════════════════════════════╝"
echo ""

read -p "App name (display name): " APP_NAME
if [ -z "$APP_NAME" ]; then
  echo "Error: App name is required"
  exit 1
fi

SLUG=$(echo "$APP_NAME" | tr '[:upper:]' '[:lower:]' | sed 's/ /-/g' | sed 's/[^a-z0-9-]//g')
read -p "Slug [$SLUG]: " INPUT_SLUG
SLUG=${INPUT_SLUG:-$SLUG}

BUNDLE_ID="com.${SLUG//-/}.app"
read -p "Bundle identifier [$BUNDLE_ID]: " INPUT_BUNDLE_ID
BUNDLE_ID=${INPUT_BUNDLE_ID:-$BUNDLE_ID}

SCHEME=$(echo "$SLUG" | sed 's/-//g')
read -p "URL scheme [$SCHEME]: " INPUT_SCHEME
SCHEME=${INPUT_SCHEME:-$SCHEME}

echo ""
echo "Configuration:"
echo "  Name:              $APP_NAME"
echo "  Slug:              $SLUG"
echo "  Bundle identifier: $BUNDLE_ID"
echo "  URL scheme:        $SCHEME"
echo ""

read -p "Confirm? (y/N): " CONFIRM
if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
  echo "Aborted."
  exit 0
fi

echo ""
echo "Updating $APP_JSON..."

TEMP_FILE=$(mktemp)
jq --arg name "$APP_NAME" \
   --arg slug "$SLUG" \
   --arg bundleId "$BUNDLE_ID" \
   --arg scheme "$SCHEME" \
   '.expo.name = $name |
    .expo.slug = $slug |
    .expo.scheme = $scheme |
    .expo.ios.bundleIdentifier = $bundleId |
    .expo.android.package = $bundleId |
    del(.expo.extra.eas.projectId) |
    del(.expo.owner)' \
   "$APP_JSON" > "$TEMP_FILE"

mv "$TEMP_FILE" "$APP_JSON"

echo "✓ $APP_JSON updated"
echo ""
echo "Running eas init..."
echo ""

npx eas init

echo ""
echo "╔════════════════════════════════════════╗"
echo "║         Initialization complete!       ║"
echo "╚════════════════════════════════════════╝"
echo ""
echo "Next steps:"
echo "  1. eas build --profile development --platform android"
echo "  2. eas update --channel development --message \"Initial\""
