# Deployment Guide

This guide covers building, deploying, and publishing your Expo app to the App Store and Play Store.

## Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        DEPLOYMENT FLOW                          │
│                                                                 │
│   Code Push ──► GitHub Actions ──► EAS Build ──► Store/OTA     │
│                                                                 │
│   ┌─────────┐    ┌──────────┐    ┌─────────┐    ┌─────────┐   │
│   │  main   │───►│   CI     │───►│  Build  │───►│ Publish │   │
│   │ branch  │    │ (lint,   │    │ (if     │    │ (OTA or │   │
│   │         │    │  test)   │    │ needed) │    │  Store) │   │
│   └─────────┘    └──────────┘    └─────────┘    └─────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Build Profiles

EAS Build uses profiles defined in `eas.json`:

### Development

For local development with dev tools enabled.

```json
{
  "development": {
    "developmentClient": true,
    "distribution": "internal",
    "ios": {
      "simulator": true
    }
  }
}
```

```bash
# Build for iOS Simulator
npx eas build --profile development --platform ios

# Build for Android Emulator
npx eas build --profile development --platform android
```

### Preview

For internal testing and QA.

```json
{
  "preview": {
    "distribution": "internal",
    "ios": {
      "simulator": false
    },
    "channel": "preview"
  }
}
```

```bash
npx eas build --profile preview --platform all
```

### Production

For App Store / Play Store submission.

```json
{
  "production": {
    "autoIncrement": true,
    "channel": "production",
    "ios": {
      "resourceClass": "m1-medium"
    }
  }
}
```

```bash
npx eas build --profile production --platform all
```

---

## CI/CD Pipeline

### GitHub Actions

The project includes a CI workflow at `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run lint

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx tsc --noEmit

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm test
```

### EAS Workflows

Located in `.eas/workflows/`:

#### Production Deployment (`deploy-production.yml`)

Triggered on push to `main`:

```yaml
name: Deploy Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    name: Deploy to Production
    steps:
      - name: Calculate Fingerprint
        run: npx expo fingerprint

      - name: Check Existing Builds
        # Checks if a build with this fingerprint exists

      - name: Build (if needed)
        if: needs.check.outputs.needs_build == 'true'
        run: eas build --profile production --platform all

      - name: Publish OTA Update
        run: eas update --branch production
```

#### Preview Deployment (`deploy-preview.yml`)

Triggered on pull requests:

```yaml
name: Deploy Preview

on:
  pull_request:
    branches: [main]

jobs:
  deploy:
    name: Deploy Preview
    steps:
      - name: Build Preview
        run: eas build --profile preview --platform all

      - name: Publish OTA Update
        run: eas update --branch preview
```

---

## Fingerprint Strategy

The project uses Expo's fingerprint system to determine when a new native build is needed vs. an OTA update.

### How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                    FINGERPRINT CHECK                         │
│                                                             │
│   Code Change ──► Calculate Fingerprint ──► Compare         │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  Fingerprint Changed?                               │   │
│   │                                                     │   │
│   │  YES (native code changed)    NO (JS only)          │   │
│   │      │                            │                 │   │
│   │      ▼                            ▼                 │   │
│   │  New Build Required          OTA Update Only        │   │
│   │  (eas build)                 (eas update)           │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### What Changes the Fingerprint

**Triggers new build:**
- Native dependencies added/updated
- `app.json` changes (plugins, permissions)
- iOS/Android specific configurations
- Expo SDK upgrade

**OTA update only:**
- JavaScript/TypeScript code changes
- Asset changes (images, fonts)
- Styling changes

### Configuration

In `app.json`:

```json
{
  "expo": {
    "runtimeVersion": {
      "policy": "fingerprint"
    }
  }
}
```

---

## Environment Secrets

### Required Secrets for EAS

Set up via `eas secret:create`:

```bash
# Sentry (for source maps)
eas secret:create --name SENTRY_AUTH_TOKEN --value "your-token"
eas secret:create --name SENTRY_ORG --value "your-org"
eas secret:create --name SENTRY_PROJECT --value "your-project"

# App-specific (if not using .env)
eas secret:create --name SUPABASE_URL --value "https://xxx.supabase.co"
eas secret:create --name SUPABASE_ANON_KEY --value "your-anon-key"
```

### GitHub Secrets (for Actions)

In your repo Settings > Secrets:

- `EXPO_TOKEN` - For EAS CLI authentication
- `SENTRY_AUTH_TOKEN` - For source map uploads

---

## OTA Updates

Over-the-air updates allow you to push JavaScript changes without a new App Store submission.

### Publishing an Update

```bash
# Update production channel
npx eas update --branch production --message "Fix: login button"

# Update preview channel
npx eas update --branch preview --message "Feature: new settings"
```

### Update Channels

| Channel | Branch | Auto-update |
|---------|--------|-------------|
| `production` | `main` | Yes |
| `preview` | PR branches | Yes |
| `development` | Any | Manual |

### Rollback

```bash
# List recent updates
npx eas update:list --branch production

# Rollback to previous update
npx eas update:rollback --branch production
```

---

## App Store Submission

### iOS (App Store Connect)

#### Prerequisites

1. Apple Developer account ($99/year)
2. App Store Connect app created
3. Certificates and provisioning profiles (handled by EAS)

#### Build and Submit

```bash
# Build for production
npx eas build --profile production --platform ios

# Submit to App Store Connect
npx eas submit --platform ios
```

#### App Store Connect Configuration

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Create a new app
3. Fill in metadata:
   - App name, description, keywords
   - Screenshots (required sizes)
   - Privacy policy URL
   - Support URL

### Android (Play Store)

#### Prerequisites

1. Google Play Developer account ($25 one-time)
2. Play Console app created
3. Signing key (handled by EAS)

#### Build and Submit

```bash
# Build for production
npx eas build --profile production --platform android

# Submit to Play Store
npx eas submit --platform android
```

#### Play Console Configuration

1. Go to [Play Console](https://play.google.com/console)
2. Create a new app
3. Fill in store listing:
   - App name, description
   - Screenshots and feature graphic
   - Privacy policy URL
   - Content rating questionnaire

---

## Monitoring Deployment

### Build Status

```bash
# View recent builds
npx eas build:list

# View specific build
npx eas build:view <build-id>
```

### Update Status

```bash
# View recent updates
npx eas update:list

# View update details
npx eas update:view <update-id>
```

### Sentry Release Tracking

After deployment, Sentry automatically tracks:
- Error rates by release
- Crash-free session percentage
- Performance metrics

---

## Checklist

### Before First Production Build

- [ ] Update `app.json` with final app name and identifiers
- [ ] Configure app icons and splash screen
- [ ] Set up Sentry for production monitoring
- [ ] Configure EAS secrets
- [ ] Test on real devices (not just simulators)
- [ ] Review privacy policy and terms of service
- [ ] Prepare store listing assets (screenshots, descriptions)

### Before Each Release

- [ ] All tests passing (`npm test`)
- [ ] No lint errors (`npm run lint`)
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] Tested on iOS and Android
- [ ] Update version in `app.json` if major release
- [ ] Write changelog/release notes

### After Release

- [ ] Monitor Sentry for new errors
- [ ] Check crash-free rate
- [ ] Respond to user reviews
- [ ] Plan next iteration
