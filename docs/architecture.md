# Architecture Guide

This boilerplate implements **Clean Architecture** with a **Feature-Based** organization, strictly enforced through ESLint rules.

## Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        PRESENTATION                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   app/      │  │   ui/       │  │ features/*/presentation │  │
│  │  (routes)   │  │ (components)│  │   (hooks, stores)       │  │
│  └──────┬──────┘  └─────────────┘  └───────────┬─────────────┘  │
│         │                                       │                │
│         └───────────────┬───────────────────────┘                │
└─────────────────────────┼───────────────────────────────────────┘
                          │
┌─────────────────────────┼───────────────────────────────────────┐
│                      DOMAIN                                      │
│         ┌───────────────┴───────────────┐                       │
│         │    features/*/domain          │                       │
│         │  ┌─────────────────────────┐  │                       │
│         │  │ entities (types)        │  │                       │
│         │  │ repositories (ports)    │  │  ← Pure business     │
│         │  │ usecases (logic)        │  │    logic, no deps    │
│         │  │ validation (schemas)    │  │                       │
│         │  └─────────────────────────┘  │                       │
│         └───────────────────────────────┘                       │
└─────────────────────────┬───────────────────────────────────────┘
                          │
┌─────────────────────────┼───────────────────────────────────────┐
│                        DATA                                      │
│         ┌───────────────┴───────────────┐                       │
│         │    features/*/data            │                       │
│         │  ┌─────────────────────────┐  │                       │
│         │  │ repositories (adapters) │  │  ← Implements ports  │
│         │  └─────────────────────────┘  │                       │
│         └───────────────────────────────┘                       │
└─────────────────────────┬───────────────────────────────────────┘
                          │
┌─────────────────────────┼───────────────────────────────────────┐
│                   INFRASTRUCTURE                                 │
│  ┌──────────────────────┴──────────────────────┐                │
│  │              infrastructure/                 │                │
│  │  ┌─────────────┐  ┌─────────────────────┐   │                │
│  │  │  supabase/  │  │     monitoring/     │   │                │
│  │  │  (client)   │  │  (sentry, analytics)│   │                │
│  │  └─────────────┘  └─────────────────────┘   │                │
│  └─────────────────────────────────────────────┘                │
└─────────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
expo-boilerplate/
│
├── app/                              # Expo Router - Presentation Layer
│   ├── _layout.tsx                   # Root layout (providers, Sentry)
│   ├── (public)/                     # Non-authenticated routes
│   │   ├── _layout.tsx
│   │   ├── index.tsx                 # Login screen
│   │   └── sign-up.tsx               # Registration screen
│   └── (protected)/                  # Authenticated routes
│       ├── _layout.tsx
│       └── (tabs)/                   # Tab navigation
│           ├── _layout.tsx
│           ├── index.tsx             # Home tab
│           └── settings.tsx          # Settings tab
│
├── features/                         # Feature Modules
│   ├── auth/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   └── session.ts        # Session type
│   │   │   ├── repositories/
│   │   │   │   └── auth-repository.ts    # Interface (port)
│   │   │   ├── usecases/
│   │   │   │   ├── sign-in.ts
│   │   │   │   ├── sign-up.ts
│   │   │   │   ├── sign-out.ts
│   │   │   │   └── refresh-session.ts
│   │   │   └── validation/
│   │   │       └── auth-schema.ts    # Zod schemas
│   │   ├── data/
│   │   │   └── repositories/
│   │   │       └── supabase-auth-repository.ts  # Implementation
│   │   └── presentation/
│   │       ├── hooks/
│   │       │   ├── use-auth.ts       # Auth mutations
│   │       │   └── use-authentication.ts  # Auth state
│   │       └── store/
│   │           └── auth-store.ts     # Zustand store
│   │
│   └── profile/                      # Same structure as auth
│
├── core/                             # Shared Code
│   ├── config/
│   │   ├── env.ts                    # Environment validation (Zod)
│   │   └── query-client.ts           # React Query config
│   ├── domain/
│   │   ├── errors/
│   │   │   └── app-error.ts          # Custom error class
│   │   └── validation/
│   │       └── validator.ts          # Validation utilities
│   ├── data/
│   │   └── storage/
│   │       └── secure-storage.ts     # Secure storage wrapper
│   └── presentation/
│       ├── components/
│       │   ├── error-boundary.tsx    # Error boundary
│       │   ├── error-fallback.tsx    # Error UI
│       │   └── splash-gate.tsx       # Splash + hydration
│       └── hooks/
│           ├── use-toggle.ts
│           ├── use-theme-sync.ts
│           └── use-app-toast.ts
│
├── infrastructure/                   # External Services
│   ├── monitoring/
│   │   └── sentry/
│   │       ├── client.ts             # Sentry init
│   │       ├── filters.ts            # Error filters
│   │       ├── types.ts              # Sentry types
│   │       ├── app-error-reporter.ts # AppError → Sentry
│   │       └── use-sentry-context.ts # React hook
│   └── supabase/
│       └── client.ts                 # Supabase client
│
├── ui/                               # Design System
│   ├── components/
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── text.tsx
│   │   ├── view.tsx
│   │   ├── safe-area-view.tsx
│   │   ├── icon.tsx
│   │   ├── skeleton.tsx
│   │   ├── tab-bar-icon.tsx
│   │   └── form/
│   │       ├── form-text-field.tsx
│   │       └── form-radio-group.tsx
│   └── theme/
│       ├── theme-store.ts            # Theme state (Zustand)
│       └── tokens.ts                 # Design tokens
│
├── i18n/                             # Internationalization
│   ├── index.ts                      # i18next config
│   └── locales/
│       ├── en.json
│       └── fr.json
│
├── __tests__/                        # Tests (mirrors features/)
└── scripts/                          # Scaffolding scripts
```

## Layer Rules

### Dependency Direction

Dependencies flow **inward only**:

```
Presentation → Domain ← Data
                ↑
          Infrastructure
```

### What Each Layer Can Import

| Layer | Can Import From |
|-------|-----------------|
| `app/` | `features/*/presentation`, `ui/`, `core/presentation` |
| `features/*/presentation` | `features/*/domain`, `ui/`, `core/` |
| `features/*/domain` | **Nothing external** (pure TypeScript only) |
| `features/*/data` | `features/*/domain`, `infrastructure/` |
| `infrastructure/` | External packages only |
| `ui/` | External packages, `core/` |

### Forbidden Imports (Enforced by ESLint)

```typescript
// ❌ Domain importing from data
// features/auth/domain/usecases/sign-in.ts
import { supabaseClient } from '@/infrastructure/supabase/client'; // ERROR!

// ❌ Domain importing from presentation
// features/auth/domain/usecases/sign-in.ts
import { useAuth } from '@/features/auth/presentation/hooks/use-auth'; // ERROR!

// ❌ Cross-feature imports at data level
// features/profile/data/repositories/profile-repository.ts
import { authStore } from '@/features/auth/presentation/store/auth-store'; // ERROR!
```

## Patterns

### Usecase Pattern (Curried Functions)

Usecases are pure functions with dependency injection via currying:

```typescript
// features/auth/domain/usecases/sign-in.ts
import type { AuthRepository } from '../repositories/auth-repository';
import type { SignInCredentials } from '../validation/auth-schema';
import type { Session } from '../entities/session';

export const signIn =
  (repository: AuthRepository) =>
  async (credentials: SignInCredentials): Promise<Session> => {
    return repository.signIn(credentials);
  };
```

**Usage in hooks:**

```typescript
// features/auth/presentation/hooks/use-auth.ts
import { signIn } from '@/features/auth/domain/usecases/sign-in';
import { createSupabaseAuthRepository } from '@/features/auth/data/repositories/supabase-auth-repository';

const authRepository = createSupabaseAuthRepository(supabaseClient);

export const useSignIn = () => {
  return useMutation({
    mutationFn: signIn(authRepository),
  });
};
```

### Repository Pattern

**1. Interface (Port) in Domain:**

```typescript
// features/auth/domain/repositories/auth-repository.ts
import type { Session } from '../entities/session';
import type { SignInCredentials, SignUpCredentials } from '../validation/auth-schema';

export interface AuthRepository {
  signIn(credentials: SignInCredentials): Promise<Session>;
  signUp(credentials: SignUpCredentials): Promise<Session>;
  signOut(): Promise<void>;
  refreshSession(): Promise<Session | null>;
  getSession(): Promise<Session | null>;
  onAuthStateChange(callback: (session: Session | null) => void): () => void;
}
```

**2. Implementation (Adapter) in Data:**

```typescript
// features/auth/data/repositories/supabase-auth-repository.ts
import type { SupabaseClient } from '@supabase/supabase-js';
import type { AuthRepository } from '@/features/auth/domain/repositories/auth-repository';

export const createSupabaseAuthRepository = (
  client: SupabaseClient,
): AuthRepository => ({
  signIn: async (credentials) => {
    const { data, error } = await client.auth.signInWithPassword(credentials);
    if (error) throw AppError.unauthorized(error.message);
    return mapToSession(data.session);
  },
  // ... other methods
});
```

### Validation Pattern (Zod)

```typescript
// features/auth/domain/validation/auth-schema.ts
import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type SignInCredentials = z.infer<typeof signInSchema>;
```

### State Management

**Client State (Zustand):**

```typescript
// features/auth/presentation/store/auth-store.ts
import { create } from 'zustand';

type AuthState = {
  session: Session | null;
  isAuthenticated: boolean;
  setSession: (session: Session | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  isAuthenticated: false,
  setSession: (session) =>
    set({ session, isAuthenticated: !!session }),
}));
```

**Server State (React Query):**

```typescript
// features/profile/presentation/hooks/use-fetch-profile.ts
import { useQuery } from '@tanstack/react-query';

export const useFetchProfile = (userId: string) => {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => fetchProfile(profileRepository)(userId),
  });
};
```

## Import Conventions

### Absolute Imports Only

```typescript
// ✅ Correct
import { AppError } from '@/core/domain/errors/app-error';
import { useAuth } from '@/features/auth/presentation/hooks/use-auth';
import { Button } from '@/ui/components/button';

// ❌ Forbidden - Relative imports
import { AppError } from '../../../core/domain/errors/app-error';

// ❌ Forbidden - Barrel imports
import { AppError, useAuth } from '@/core';
```

### Import Order (Enforced by ESLint)

```typescript
// 1. External packages
import * as Sentry from '@sentry/react-native';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

// 2. Type imports (external)
import type { SupabaseClient } from '@supabase/supabase-js';

// 3. Internal absolute imports
import { AppError } from '@/core/domain/errors/app-error';
import { Button } from '@/ui/components/button';

// 4. Type imports (internal)
import type { Session } from '@/features/auth/domain/entities/session';
```

## Naming Conventions

### Files

- **kebab-case** for all files: `use-auth.ts`, `auth-repository.ts`
- **One file = one export** (no barrel files)

### Code

```typescript
// ✅ Explicit names
const isSubmitButtonDisabled = true;
const isEmailInputFocused = false;
const onPressSignInButton = () => {};

// ❌ Vague names
const isDisabled = true;
const isFocused = false;
const onClick = () => {};
```

### Forbidden Words

Never use in naming:
- `handle` → use `onPress`, `onSubmit`, `onChange`
- `manage` → be specific about the action
- `process` → describe what is being done

## Error Handling

### AppError Class

```typescript
// core/domain/errors/app-error.ts
export type AppErrorCode =
  | 'UNKNOWN'
  | 'VALIDATION'
  | 'NETWORK'
  | 'UNAUTHORIZED'
  | 'NOT_FOUND'
  | 'CONFLICT';

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly originalError?: unknown;

  static validation(message: string): AppError;
  static network(message: string, originalError?: unknown): AppError;
  static unauthorized(message: string): AppError;
  static notFound(message: string): AppError;
}
```

### Error Flow

```
Repository throws AppError
        ↓
Usecase propagates error
        ↓
Hook catches in onError
        ↓
Toast displays message + Sentry captures
```

## Testing Strategy

```
__tests__/
├── features/
│   ├── auth/
│   │   ├── domain/usecases/     # 100% coverage required
│   │   └── presentation/hooks/  # 100% coverage required
│   └── profile/
│       ├── domain/usecases/
│       └── presentation/hooks/
├── infrastructure/
│   └── monitoring/sentry/
└── ui/components/
```

### Test Example

```typescript
// __tests__/features/auth/domain/usecases/sign-in.test.ts
describe('signIn', () => {
  it('should return session on successful sign in', async () => {
    const mockRepository: AuthRepository = {
      signIn: jest.fn().mockResolvedValue(mockSession),
      // ...
    };

    const result = await signIn(mockRepository)(credentials);

    expect(result).toEqual(mockSession);
    expect(mockRepository.signIn).toHaveBeenCalledWith(credentials);
  });
});
```
