# Claude Code Instructions - Expo Boilerplate

> **Clean Architecture and SRP are a religion here.**
> There is NO exception, NO compromise, NO shortcut.
> Every violation is a sin. Every sin must be refactored immediately.

## Quick Reference

```bash
npm run lint          # ESLint with boundary validation
npm run start         # Expo dev server
npm run ios           # iOS simulator
npm run android       # Android emulator
npx tsc --noEmit      # TypeScript check
```

**Before coding**: Ask questions → Use TodoWrite → Verify with `tsc` and `lint` after each modification.

---

## Architecture

This project follows a **Clean Architecture Feature-Based** pattern.

### Folder Structure

```
features/{feature-name}/
├── domain/                    # Pure business logic, NO external dependencies
│   ├── entities/              # Business types and interfaces
│   ├── repositories/          # Interfaces (ports) - NO implementation
│   ├── usecases/              # Pure business functions
│   └── validation/            # Zod schemas
├── data/                      # Concrete implementations
│   └── repositories/          # Adapters (implement domain interfaces)
└── presentation/              # React layer
    ├── hooks/                 # Custom hooks
    ├── store/                 # Zustand stores + DI holders
    ├── context/               # React contexts (if needed)
    └── query-keys.ts          # React Query keys

core/
├── domain/
│   ├── errors/                # AppError, error types
│   ├── storage/               # Storage adapter interface
│   ├── validation/            # validateWithI18n helpers
│   └── monitoring/            # Sentry types
├── data/
│   ├── storage/               # SecureStorage implementation
│   └── monitoring/            # SentryErrorReporter
├── presentation/
│   ├── components/            # ErrorBoundary, SplashGate
│   ├── hooks/                 # useToggle, etc.
│   └── store/                 # Storage provider
└── config/
    └── query-client.ts

infrastructure/
├── supabase/                  # Supabase client
└── monitoring/sentry/         # Sentry integration

ui/
├── components/                # Reusable UI wrappers
└── theme/                     # Design tokens
```

### Layer Dependencies

```
app/ → features/*/presentation/ → features/*/domain/
                ↓
        features/*/data/ → infrastructure/
```

| Layer | Can Import From |
|-------|-----------------|
| `domain/` | `core/domain/` only - **NEVER** from `data/`, `presentation/`, `infrastructure/` |
| `data/` | `domain/`, `core/domain/`, `core/data/`, `infrastructure/` |
| `presentation/` | `domain/`, `data/`, `core/`, `ui/` |
| `infrastructure/` | `core/config/`, `core/data/` only |

ESLint enforces these boundaries automatically via `eslint-plugin-boundaries`.

### Import Rules

```typescript
// ✅ CORRECT - Direct imports, explicit paths
import { AppError } from "@/core/domain/errors/app-error";
import { useAuth } from "@/features/auth/presentation/hooks/use-auth";
import type { Session } from "@/features/auth/domain/entities/session";

// ❌ FORBIDDEN - No barrel imports (index.ts)
import { AppError } from "@/core";
import { useAuth, Session } from "@/features/auth";
```

**Never create `index.ts` files** for re-exports. Each import must point to the exact file.

---

## Patterns

### Usecase Pattern

Usecases are **curried functions** with repository injection:

```typescript
// features/auth/domain/usecases/sign-in.ts
export const signIn =
  (repository: AuthRepository) =>
  async (credentials: SignInCredentials): Promise<Session> => {
    const validated = validateWithI18n(signInSchema, credentials);
    return repository.signIn(validated);
  };

// Usage
const session = await signIn(authRepository)(credentials);
```

### Repository Pattern

1. **Interface in `domain/`** - Defines the contract
2. **Implementation in `data/`** - Connected to infra (Supabase, API, etc.)

```typescript
// domain/repositories/auth-repository.ts
export interface AuthRepository {
  signIn(credentials: SignInCredentials): Promise<Session>;
  signOut(): Promise<void>;
}

// data/repositories/supabase-auth-repository.ts
export const createSupabaseAuthRepository = (
  client: SupabaseClient,
): AuthRepository => ({
  signIn: async (credentials) => {
    /* impl */
  },
  signOut: async () => {
    /* impl */
  },
});
```

### Query Keys Pattern

Each feature with React Query defines its query keys:

```typescript
// features/profile/presentation/query-keys.ts
export const profileQueryKeys = {
  all: ['profile'] as const,
  byUserId: (userId: string | undefined) => ['profile', userId] as const,
};

// Usage in hooks
useQuery({
  queryKey: profileQueryKeys.byUserId(user?.id),
  queryFn: fetchProfile(repository),
});
```

### Repository Initialization (DI)

Repositories are initialized in `app/_layout.tsx`:

```typescript
// Create repository instance
const authRepository = createSupabaseAuthRepository(supabaseClient);

// Inject into store and presentation layer
initializeAuthStore(authRepository);
initializeAuthRepository(authRepository);
```

Each feature with a repository needs:

1. `presentation/store/{feature}-repository.ts` - DI holder with `initializeXRepository()` and `getXRepository()`
2. Initialization call in `_layout.tsx`

---

## State Management

### Zustand (Client State)

For auth, theme, preferences, and other client-side state:

```typescript
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      session: null,
      setSession: (session) => set({ session }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({ session: state.session }),
    }
  )
);
```

### React Query (Server State)

For API data fetching and caching:

```typescript
// features/profile/presentation/hooks/use-fetch-profile.ts
export const useFetchProfile = () => {
  const repository = getProfileRepository();
  const { user } = useAuth();

  return useQuery({
    queryKey: profileQueryKeys.byUserId(user?.id),
    queryFn: fetchProfile(repository),
    enabled: !!user,
  });
};
```

### Storage & Persistence

- **Secure storage**: `@/core/data/storage/secure-storage.ts` (wraps Expo SecureStore)
- **Storage DI**: `StorageProvider` context in `core/presentation/store/`
- Zustand stores use `persist` middleware with `createJSONStorage()`

---

## Validation

- **Zod** for all validation
- Schemas in `domain/validation/`
- Types inferred from schemas: `type User = z.infer<typeof userSchema>`
- Use `validateWithI18n()` for i18n-aware error messages

```typescript
// domain/validation/auth-schema.ts
export const signInSchema = z.object({
  email: z.string().email('errors.email.invalid'),
  password: z.string().min(1, 'errors.password.required'),
});

// Usage with i18n
import { validateWithI18n } from '@/core/domain/validation/validator';
const validated = validateWithI18n(signInSchema, data);
```

---

## Internationalization (i18n)

- **i18next** for translations
- Translation files in `i18n/locales/{lang}/`
- Zod errors use i18n keys that get translated via `validateWithI18n()`

---

## UI & Styling

### Stack

- **HeroUI Native** for components
- **Uniwind** (Tailwind v4) for styling
- UI wrappers in `ui/components/`
- Design tokens in `ui/theme/`

### Component Priority Checklist

Before using any UI component:

1. **Search `ui/components/`** for existing wrappers
2. **If found** → Use it (e.g., `@/ui/components/view` instead of `react-native`)
3. **If not found** → Check HeroUI Native docs via MCP Context7
4. **Still not found** → Ask user if a new wrapper should be created

```typescript
// ❌ FORBIDDEN - Direct import when wrapper exists
import { View } from "react-native";
import { Button } from "heroui-native";

// ✅ CORRECT - Use project wrappers
import { View } from "@/ui/components/view";
import { Button } from "@/ui/components/button";
```

```typescript
// ❌ FORBIDDEN - Custom color constants
const COLORS = { light: { text: "#11181C" }, dark: { text: "#ECEDEE" } };

// ✅ CORRECT - Use HeroUI hook
import { useThemeColor } from "heroui-native";
const [textColor] = useThemeColor(["foreground"]);
```

```typescript
// ❌ FORBIDDEN - Custom Option component
export function Option({ isSelected, onPress, children }) { ... }

// ✅ CORRECT - Use HeroUI RadioGroup
import { RadioGroup } from 'heroui-native';
<RadioGroup.Item value={value}>
  <RadioGroup.Label>{label}</RadioGroup.Label>
  <RadioGroup.Indicator />
</RadioGroup.Item>
```

---

## Error Handling & Monitoring

### AppError

Typed errors via `core/domain/errors/app-error.ts`:

```typescript
throw new AppError('NETWORK_ERROR', 'Failed to fetch profile');

// Error types: AUTH_ERROR | NETWORK_ERROR | VALIDATION_ERROR | UNKNOWN_ERROR
```

### Sentry

- Integration in `infrastructure/monitoring/sentry/`
- Error reporter in `core/data/monitoring/sentry-error-reporter.ts`
- `ErrorBoundary` component wraps the app

---

## Code Conventions

### Naming

```typescript
// ✅ Explicit and descriptive names
const isSubmitButtonDisabled = true;
const isEmailInputFocused = false;
const onPressSignInButton = () => {};

// ❌ Vague names
const isDisabled = true;
const isFocused = false;
const onPress = () => {};
```

### Forbidden Words

Never use these words in naming:

| Forbidden | Use Instead |
|-----------|-------------|
| `handle` | `onPress`, `onSubmit`, `onChange`, etc. |
| `manage` | Be specific: `updateUser`, `deleteSession` |
| `process` | Describe the action: `parseResponse`, `transformData` |

### Files

- **kebab-case** for file names: `use-auth.ts`, `auth-repository.ts`
- **One file = one responsibility**
- **No nested components** - Extract into separate files

### Code

- **No comments** unless absolutely necessary
- **No Co-Authored-By** in commits
- **Pure functions** when possible
- **One function = one responsibility**

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Expo SDK 54 (do not downgrade) |
| Navigation | Expo Router (file-based) |
| Architecture | New Architecture enabled |
| Animations | Reanimated v4 + react-native-worklets |
| Backend | Supabase (**Firebase NOT supported**) |
| State (client) | Zustand |
| State (server) | React Query |
| Validation | Zod |
| UI | HeroUI Native |
| Styling | Uniwind (Tailwind v4) |
| Testing | Jest + Testing Library + MSW |
| Monitoring | Sentry |

---

## Testing

- **Jest** + **Testing Library** for tests
- **MSW** for mocking API calls
- Test structure mirrors `features/` in `__tests__/`

---

## Resources

- [ROADMAP.md](./ROADMAP.md) - Refactoring plan with remaining phases
- [Expo Docs](https://docs.expo.dev/)
- [HeroUI Native](https://v3.heroui.com/docs/native/getting-started)
- [Uniwind](https://docs.uniwind.dev/)
