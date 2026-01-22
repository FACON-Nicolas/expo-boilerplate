# Claude Code Instructions - Expo Boilerplate

## Architecture

This project follows a **Clean Architecture Feature-Based** pattern. Strictly respect this structure.

### Folder structure

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
    ├── store/                 # Zustand stores
    └── context/               # React contexts (if needed)
```

### Import rules

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

### Usecase pattern

Usecases are **curried functions** with repository injection:

```typescript
// features/auth/domain/usecases/sign-in.ts
export const signIn =
  (repository: AuthRepository) =>
  async (credentials: SignInCredentials): Promise<Session> => {
    return repository.signIn(credentials);
  };

// Usage
const session = await signIn(authRepository)(credentials);
```

### Repository pattern

1. **Interface in domain/** - Defines the contract
2. **Implementation in data/** - Connected to infra (Supabase, API, etc.)

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

### Layer dependencies

```
app/ → features/*/presentation/ → features/*/domain/
                ↓
        features/*/data/ → infrastructure/
```

- `domain/` must NEVER import from `data/`, `presentation/`, or `infrastructure/`
- `presentation/` imports from `domain/` and `data/`
- `data/` imports from `domain/` and `infrastructure/`

## State Management

- **Zustand** for client state (auth, theme, preferences)
- **React Query** for server state (API data)

## Validation

- **Zod** for all validation
- Schemas are in `domain/validation/`
- Types are inferred from schemas: `type User = z.infer<typeof userSchema>`

## Styling

- **HeroUI Native** + **Uniwind** (Tailwind v4) for components
- UI components are in `ui/components/`
- Design tokens are in `ui/theme/`

## Backend

- **Supabase** is the default backend
- **Firebase is NOT supported** - Never suggest Firebase
- For a custom backend, create a new repository in `data/repositories/`

## Code conventions

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

### Forbidden words in naming

Never use these words:

- `handle` → use `onPress`, `onSubmit`, `onChange`, etc.
- `manage` → be more specific about the action
- `process` → describe what is actually being done

### Files

- **kebab-case** for file names: `use-auth.ts`, `auth-repository.ts`
- **One file = one responsibility**
- **No nested components** - Extract into separate files

### Code

- **No comments** unless absolutely necessary
- **No Co-Authored-By** in commits
- **Pure functions** when possible
- **One function = one responsibility**

## Expo & React Native

- **Expo SDK 54** - Do not downgrade
- **Expo Router** for navigation (file-based routing)
- **New Architecture** enabled
- **Reanimated v4** with `react-native-worklets`

## Testing

- **Jest** + **Testing Library** for tests
- **MSW** for mocking API calls
- Test structure mirrors `features/` in `__tests__/`

## Before coding

1. **Ask questions** to clarify context and edge cases
2. **Use TodoWrite** to plan complex tasks
3. **Verify** with `npx tsc --noEmit` and `npm run lint` after each modification

## Available scripts

```bash
npm run lint          # ESLint
npm run start         # Expo dev server
npm run ios           # iOS simulator
npm run android       # Android emulator
```

## Resources

- [ROADMAP.md](./ROADMAP.md) - Detailed refactoring plan with remaining phases
- [Expo Docs](https://docs.expo.dev/)
- [HeroUI Native](https://v3.heroui.com/docs/native/getting-started)
- [Uniwind](https://docs.uniwind.dev/)
