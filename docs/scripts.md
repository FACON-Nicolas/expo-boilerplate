# Scripts Documentation

This boilerplate includes powerful scaffolding scripts to help you manage features, backends, and project setup.

## Overview

| Script | Description |
|--------|-------------|
| `npm run init` | Initialize app with Expo/EAS configuration |
| `npm run setup:minimal` | Reset to minimal state (Supabase + Auth + Profile) |
| `npm run add:feature` | Scaffold a new feature module |
| `npm run remove:feature` | Remove a feature module |
| `npm run add:supabase` | Add Supabase backend |
| `npm run remove:supabase` | Remove Supabase backend |
| `npm run add:custom-backend` | Add custom REST API backend |
| `npm run remove:custom-backend` | Remove custom backend |
| `npm run add:auth` | Add authentication feature |
| `npm run remove:auth` | Remove authentication feature |
| `npm run add:profile` | Add profile feature |
| `npm run remove:profile` | Remove profile feature |

---

## Feature Management

### `npm run add:feature <name>`

Scaffolds a complete feature module following Clean Architecture.

**Usage:**

```bash
npm run add:feature todos
```

**What it creates:**

```
features/todos/
├── domain/
│   ├── entities/
│   │   └── todo.ts
│   ├── repositories/
│   │   └── todo-repository.ts
│   ├── usecases/
│   │   ├── fetch-todos.ts
│   │   └── create-todo.ts
│   └── validation/
│       └── todo-schema.ts
├── data/
│   └── repositories/
│       └── supabase-todo-repository.ts
└── presentation/
    └── hooks/
        ├── use-fetch-todos.ts
        └── use-create-todo.ts
```

**Options:**

| Flag | Description |
|------|-------------|
| `--dry-run` | Preview changes without creating files |
| `--force` | Overwrite existing feature |

**Examples:**

```bash
# Preview what will be created
npm run add:feature todos -- --dry-run

# Force overwrite existing feature
npm run add:feature todos -- --force
```

---

### `npm run remove:feature <name>`

Removes a feature module and cleans up related files.

**Usage:**

```bash
npm run remove:feature todos
```

**What it removes:**

- `features/todos/` directory
- `__tests__/features/todos/` directory
- Related entries in `scripts/config/features.json`

**Options:**

| Flag | Description |
|------|-------------|
| `--dry-run` | Preview changes without deleting |
| `--force` | Skip confirmation prompt |

---

## Backend Management

### `npm run add:supabase`

Adds Supabase configuration to the project.

**Usage:**

```bash
npm run add:supabase
```

**What it creates/modifies:**

- `infrastructure/supabase/client.ts` - Supabase client setup
- Updates `core/config/env.ts` with Supabase env vars
- Updates `.env.example`

**Prerequisites:**

You need a Supabase project. Get your credentials from:
- **Project URL:** Settings > API > Project URL
- **Anon Key:** Settings > API > anon public

---

### `npm run remove:supabase`

Removes Supabase from the project.

**Usage:**

```bash
npm run remove:supabase
```

**What it removes:**

- `infrastructure/supabase/` directory
- Supabase env vars from `core/config/env.ts`
- `@supabase/supabase-js` dependency

> ⚠️ This will also remove features depending on Supabase (auth, profile) unless you've migrated them to a custom backend.

---

### `npm run add:custom-backend`

Sets up a custom REST API backend structure.

**Usage:**

```bash
npm run add:custom-backend
```

**What it creates:**

```
infrastructure/
└── api/
    ├── client.ts           # Fetch/Axios client setup
    ├── interceptors.ts     # Auth interceptors
    └── types.ts            # API response types
```

**Configuration:**

After running, add to your `.env`:

```bash
EXPO_PUBLIC_API_BASE_URL=https://api.yourservice.com
```

---

### `npm run remove:custom-backend`

Removes the custom backend infrastructure.

**Usage:**

```bash
npm run remove:custom-backend
```

---

## Auth & Profile Features

### `npm run add:auth`

Adds the authentication feature with full Clean Architecture structure.

**Usage:**

```bash
npm run add:auth
```

**What it creates:**

- Complete `features/auth/` structure
- Auth routes in `app/(public)/`
- Protected routes wrapper in `app/(protected)/`
- Tests in `__tests__/features/auth/`

**Includes:**

- Sign in / Sign up / Sign out usecases
- Session management
- Auth store (Zustand)
- React Query hooks

---

### `npm run remove:auth`

Removes the authentication feature.

**Usage:**

```bash
npm run remove:auth
```

> ⚠️ This will break protected routes. Make sure to update your navigation structure.

---

### `npm run add:profile`

Adds the profile management feature.

**Usage:**

```bash
npm run add:profile
```

**What it creates:**

- `features/profile/` structure
- Profile entity and repository
- Fetch and create profile usecases
- React Query hooks

**Prerequisites:**

- Auth feature must be installed
- Supabase `profiles` table must exist

---

### `npm run remove:profile`

Removes the profile feature.

**Usage:**

```bash
npm run remove:profile
```

---

## Project Setup

### `npm run init`

Initializes the Expo/EAS configuration for a new project.

**Usage:**

```bash
npm run init
```

**What it does:**

1. Prompts for app name and bundle identifier
2. Updates `app.json` with your configuration
3. Runs `eas build:configure`
4. Creates EAS project if needed

**Interactive prompts:**

```
? App name: My Awesome App
? Bundle identifier: com.mycompany.myawesomeapp
? Create new EAS project? (Y/n)
```

---

### `npm run setup:minimal`

Resets the project to a minimal working state with Supabase, Auth, and Profile.

**Usage:**

```bash
npm run setup:minimal
```

**What it does:**

1. Removes all custom features
2. Ensures Supabase is configured
3. Adds Auth feature
4. Adds Profile feature
5. Cleans up unused files

**Use case:**

Starting fresh after experimenting, or setting up a new project based on the boilerplate.

---

## Feature Registry

Features are tracked in `scripts/config/features.json`:

```json
{
  "features": {
    "auth": {
      "enabled": true,
      "dependencies": ["supabase"]
    },
    "profile": {
      "enabled": true,
      "dependencies": ["supabase", "auth"]
    },
    "todos": {
      "enabled": true,
      "dependencies": ["supabase"]
    }
  },
  "backends": {
    "supabase": true,
    "customApi": false
  }
}
```

This file is automatically updated by the scripts. You can also edit it manually if needed.

---

## Common Workflows

### Starting a New Project

```bash
# 1. Clone and install
git clone https://github.com/your-username/expo-boilerplate.git my-app
cd my-app
npm install

# 2. Initialize with your app details
npm run init

# 3. Configure environment
cp .env.example .env
# Edit .env with your Supabase credentials

# 4. Run the app
npm run ios
```

### Adding a New Feature

```bash
# 1. Scaffold the feature
npm run add:feature orders

# 2. Implement your business logic
# Edit features/orders/domain/...

# 3. Implement the repository
# Edit features/orders/data/repositories/...

# 4. Create routes
# Add files in app/(protected)/orders/...

# 5. Run tests
npm test
```

### Switching from Supabase to Custom Backend

```bash
# 1. Add custom backend
npm run add:custom-backend

# 2. Update your repositories in features/*/data/
# Change from supabase-*-repository.ts to api-*-repository.ts

# 3. Remove Supabase (optional)
npm run remove:supabase
```

---

## Troubleshooting Scripts

### "Feature already exists"

Use `--force` to overwrite:

```bash
npm run add:feature todos -- --force
```

### "Cannot remove: dependencies exist"

Remove dependent features first:

```bash
# Wrong order
npm run remove:auth  # Error: profile depends on auth

# Correct order
npm run remove:profile
npm run remove:auth
```

### Script Fails Silently

Check the feature registry:

```bash
cat scripts/config/features.json
```

Reset if corrupted:

```bash
npm run setup:minimal
```
