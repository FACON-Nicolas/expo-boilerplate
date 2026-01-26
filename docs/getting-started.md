# Getting Started

This guide will help you set up the Expo Boilerplate and run your first build in under 10 minutes.

## Prerequisites

Before you begin, ensure you have the following installed:

| Tool | Version | Check Command |
|------|---------|---------------|
| Node.js | 18+ | `node -v` |
| npm | 9+ | `npm -v` |
| Expo CLI | Latest | `npx expo --version` |
| EAS CLI | Latest | `npx eas --version` |
| Xcode | 15+ (macOS only) | `xcodebuild -version` |
| Android Studio | Latest | Required for Android emulator |

### Install Expo & EAS CLI

```bash
npm install -g expo-cli eas-cli
```

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/expo-boilerplate.git my-app
cd my-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```bash
# Required - Supabase
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key

# Optional - Dev credentials for faster testing
EXPO_PUBLIC_SUPABASE_EMAIL_LOGIN_DEV=dev@example.com
EXPO_PUBLIC_SUPABASE_PASSWORD_LOGIN_DEV=your-dev-password

# Optional - Sentry (error tracking)
EXPO_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
EXPO_PUBLIC_SENTRY_ENABLED=true
```

### 4. Set Up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **Settings > API** to get your URL and anon key
3. Enable **Email Auth** in **Authentication > Providers**
4. Create the `profiles` table:

```sql
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table profiles enable row level security;

-- Policies
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);
```

## Running the App

### iOS Simulator

```bash
npm run ios
```

### Android Emulator

```bash
npm run android
```

### Expo Go (Limited)

```bash
npm start
```

> ⚠️ **Note:** Some features (native modules, Sentry native tracking) require a development build and won't work in Expo Go.

## Creating a Development Build

For full functionality, create a development build:

### 1. Configure EAS

```bash
npx eas build:configure
```

### 2. Build for iOS Simulator

```bash
npx eas build --profile development --platform ios
```

### 3. Build for Android Emulator

```bash
npx eas build --profile development --platform android
```

### 4. Install and Run

After the build completes, download and install the `.app` (iOS) or `.apk` (Android) file, then:

```bash
npm start
```

## Project Configuration

### Renaming Your App

1. Update `app.json`:

```json
{
  "expo": {
    "name": "Your App Name",
    "slug": "your-app-slug",
    "scheme": "yourapp",
    "ios": {
      "bundleIdentifier": "com.yourcompany.yourapp"
    },
    "android": {
      "package": "com.yourcompany.yourapp"
    }
  }
}
```

2. Run the init script to update EAS:

```bash
npm run init
```

### Customizing the Theme

Edit the theme tokens in `ui/theme/tokens.ts` and the theme store in `ui/theme/theme-store.ts`.

## Verification

Run these commands to ensure everything is set up correctly:

```bash
# Type checking
npx tsc --noEmit

# Linting
npm run lint

# Tests
npm test
```

All commands should pass without errors.

## Next Steps

- 📖 Read the [Architecture Guide](./architecture.md) to understand the codebase structure
- 🛠️ Learn about [Available Scripts](./scripts.md) for scaffolding features
- 🚀 Check the [Deployment Guide](./deployment.md) for production builds
- 🐛 See [Troubleshooting](./troubleshooting.md) if you encounter issues

## Quick Reference

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo dev server |
| `npm run ios` | Run on iOS simulator |
| `npm run android` | Run on Android emulator |
| `npm test` | Run tests |
| `npm run lint` | Check code quality |
| `npm run add:feature <name>` | Scaffold a new feature |
