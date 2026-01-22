# Expo Boilerplate v2 - Roadmap de Refonte

## Contexte

Cette boilerplate est en cours de refonte pour devenir une base **modulaire**, **scriptable** et **production-ready** permettant de lancer un nouveau projet mobile rapidement.

### Ce qui a été fait

- ✅ **Phase 1 : Clean Architecture + Feature-Based** - Structure migrée
- ✅ **Upgrade Expo 53 → 54** - SDK 54, React 19.1, React Native 0.81.5, Reanimated v4

### Structure actuelle

```
expo-boilerplate/
├── app/                              # Expo Router (Presentation Layer)
│   ├── _layout.tsx
│   ├── (public)/                     # Routes non authentifiées
│   └── (protected)/                  # Routes authentifiées
│       ├── (tabs)/                   # Navigation tabs
│       └── (onboarding)/             # Flow onboarding
│
├── features/                         # Feature Modules (Clean Archi)
│   ├── auth/
│   │   ├── domain/
│   │   │   ├── entities/session.ts
│   │   │   ├── repositories/auth-repository.ts    # Interface (port)
│   │   │   ├── usecases/sign-in.ts, sign-up.ts, sign-out.ts, refresh-session.ts
│   │   │   └── validation/auth-schema.ts
│   │   ├── data/
│   │   │   └── repositories/supabase-auth-repository.ts  # Implémentation (adapter)
│   │   └── presentation/
│   │       ├── hooks/use-auth.ts, use-authentication.ts
│   │       └── store/auth-store.ts
│   │
│   ├── profile/
│   │   ├── domain/
│   │   │   ├── entities/profile.ts
│   │   │   ├── repositories/profile-repository.ts
│   │   │   ├── usecases/fetch-profile.ts, create-profile.ts
│   │   │   └── validation/profile-schema.ts
│   │   ├── data/
│   │   │   └── repositories/supabase-profile-repository.ts
│   │   └── presentation/
│   │       └── hooks/use-fetch-profile.ts, use-create-profile.ts
│   │
│   └── onboarding/
│       ├── domain/
│       │   ├── entities/onboarding-data.ts
│       │   └── validation/onboarding-schema.ts
│       └── presentation/
│           └── context/onboarding-context.tsx
│
├── core/                             # Shared Domain
│   ├── domain/errors/app-error.ts
│   ├── data/
│   │   ├── storage/secure-storage.ts
│   │   └── validation/validator.ts
│   └── presentation/hooks/
│       ├── use-theme-color.ts
│       └── use-toggle.ts
│
├── infrastructure/                   # External Dependencies
│   └── supabase/client.ts
│
├── components/                       # Composants UI (à migrer vers ui/ en Phase 2)
├── constants/Colors.ts
├── i18n/
└── assets/
```

### Principes de la Clean Architecture appliqués

1. **Domain** : Entités + Interfaces (ports) = logique métier pure, aucune dépendance externe
2. **Data** : Implémentations (adapters) = branchées sur l'infra réelle (Supabase)
3. **Presentation** : Hooks + Stores = React-aware, consomme le domain

### Pattern des Usecases

Les usecases sont des **fonctions curried** avec injection de dépendances :

```typescript
// Définition
export const signIn = (repository: AuthRepository) =>
  async (credentials: SignInCredentials): Promise<Session> => {
    return repository.signIn(credentials);
  };

// Utilisation
const authRepository = createSupabaseAuthRepository(supabaseClient);
const session = await signIn(authRepository)(credentials);
```

### Imports

**Convention** : Imports directs, pas de barrels (`index.ts`).

```typescript
// ✅ Correct
import { AppError } from '@/core/domain/errors/app-error';
import { useAuth } from '@/features/auth/presentation/hooks/use-auth';

// ❌ Éviter
import { AppError } from '@/core';
```

---

## Phase 2 : HeroUI Native + Design System

### Objectif

Migrer le système de styling vers **HeroUI Native** (Tailwind v4 via Uniwind) pour avoir une UI moderne et cohérente.

### Prérequis

- Lire la doc HeroUI Native : https://v3.heroui.com/docs/native/getting-started
- Lire la doc Uniwind : https://docs.uniwind.dev/quickstart

### Tâches

#### 2.1 Setup Uniwind (Tailwind v4 pour React Native)

1. Installer les dépendances :
   ```bash
   npx expo install uniwind react-native-css tailwind-variants tailwind-merge
   ```

2. Créer `global.css` à la racine :
   ```css
   @import 'tailwindcss';
   @import 'uniwind';
   ```

3. Configurer Metro pour Uniwind (voir doc Uniwind)

4. Importer `global.css` dans `app/_layout.tsx`

#### 2.2 Setup HeroUI Native

1. Installer HeroUI Native :
   ```bash
   npx expo install heroui-native @gorhom/bottom-sheet react-native-svg
   ```

2. Mettre à jour `global.css` :
   ```css
   @import 'tailwindcss';
   @import 'uniwind';
   @import 'heroui-native/styles';
   @source './node_modules/heroui-native/lib';
   ```

3. Wrapper l'app avec `HeroUINativeProvider` dans `app/_layout.tsx` :
   ```typescript
   import { HeroUINativeProvider } from 'heroui-native';
   import { GestureHandlerRootView } from 'react-native-gesture-handler';

   export default function RootLayout() {
     return (
       <GestureHandlerRootView style={{ flex: 1 }}>
         <HeroUINativeProvider>
           {/* reste de l'app */}
         </HeroUINativeProvider>
       </GestureHandlerRootView>
     );
   }
   ```

#### 2.3 Créer le Design System

1. Créer `ui/theme/tokens.ts` avec les tokens de design :
   - Colors (primary, secondary, error, success, warning, background, text)
   - Spacing (xs, sm, md, lg, xl)
   - Typography (font sizes, weights)
   - Border radius

2. Configurer le thème HeroUI avec ces tokens

#### 2.4 Migrer les composants themed

Migrer chaque composant de `components/themed-*.tsx` vers `ui/components/` en utilisant HeroUI :

| Ancien | Nouveau | Composant HeroUI |
|--------|---------|------------------|
| `themed-button.tsx` | `ui/components/button.tsx` | `Button` de heroui-native |
| `themed-input.tsx` | `ui/components/input.tsx` | `Input` de heroui-native |
| `themed-text.tsx` | `ui/components/text.tsx` | Custom avec Tailwind |
| `themed-view.tsx` | `ui/components/view.tsx` | Custom avec Tailwind |
| `themed-option.tsx` | `ui/components/option.tsx` | Custom ou `Chip` |
| `themed-link.tsx` | `ui/components/link.tsx` | Custom avec `Link` expo-router |
| `themed-safe-area-view.tsx` | `ui/components/safe-area-view.tsx` | Wrapper `SafeAreaView` |

3. Mettre à jour les imports dans `app/` pour pointer vers `ui/components/`

4. Supprimer `components/themed-*.tsx` une fois la migration complète

#### 2.5 Dark Mode Toggle

1. Créer `ui/theme/theme-store.ts` (Zustand) :
   ```typescript
   type ThemeMode = 'light' | 'dark' | 'system';

   interface ThemeStore {
     mode: ThemeMode;
     setMode: (mode: ThemeMode) => void;
   }
   ```

2. Persister le choix utilisateur avec `expo-secure-store`

3. Ajouter un toggle dans l'écran Profile

#### 2.6 Loading Skeletons

1. Créer `ui/components/skeleton.tsx` pour les états de chargement
2. Remplacer les `return null` pendant le loading par des skeletons

### Critères de validation

- [ ] L'app démarre sans erreur
- [ ] Le thème light/dark fonctionne
- [ ] Tous les composants utilisent HeroUI/Tailwind
- [ ] `npm run lint` passe
- [ ] `npx tsc --noEmit` passe

---

## Phase 3 : Forms & Validation (React Hook Form)

### Objectif

Améliorer la DX des formulaires avec React Hook Form + Zod.

### Prérequis

- Lire la doc React Hook Form : https://react-hook-form.com/
- Lire l'intégration Zod : https://react-hook-form.com/get-started#SchemaValidation

### Tâches

#### 3.1 Setup React Hook Form

```bash
npm install react-hook-form @hookform/resolvers
```

#### 3.2 Créer les composants de form

Créer `ui/components/form/` :

1. `form-field.tsx` - Wrapper avec label + error message
2. `form-input.tsx` - Input connecté à RHF via `Controller`
3. `form-select.tsx` - Select/Picker connecté à RHF

Exemple :
```typescript
import { Controller, useFormContext } from 'react-hook-form';
import { Input } from 'heroui-native';

interface FormInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
}

export function FormInput({ name, label, ...props }: FormInputProps) {
  const { control, formState: { errors } } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <Input
          label={label}
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          isInvalid={!!errors[name]}
          errorMessage={errors[name]?.message as string}
          {...props}
        />
      )}
    />
  );
}
```

#### 3.3 Refacto des écrans de formulaire

Refactoriser avec RHF + Zod :

1. **Login** (`app/(public)/index.tsx`)
   - Utiliser `useForm` avec `zodResolver(signInSchema)`
   - Remplacer le state local par `register` / `Controller`

2. **Sign Up** (`app/(public)/sign-up.tsx`)
   - Utiliser `useForm` avec `zodResolver(signUpSchema)`

3. **Identity** (`app/(protected)/(onboarding)/identity.tsx`)
   - Utiliser `useForm` avec `zodResolver(identitySchema)`

4. **Age** (`app/(protected)/(onboarding)/age.tsx`)
   - Utiliser `useForm` avec `zodResolver(ageSchema)`

### Critères de validation

- [ ] Les formulaires utilisent React Hook Form
- [ ] La validation Zod s'affiche en temps réel
- [ ] Les erreurs i18n fonctionnent toujours
- [ ] `npm run lint` passe
- [ ] `npx tsc --noEmit` passe

---

## Phase 4 : Error Handling & Config

### Objectif

Robustesse production avec error handling global et validation de config.

### Tâches

#### 4.1 Error Boundary Global

1. Créer `core/presentation/components/error-boundary.tsx` :
   ```typescript
   import { Component, ReactNode } from 'react';

   interface Props {
     children: ReactNode;
     fallback: ReactNode;
   }

   interface State {
     hasError: boolean;
     error?: Error;
   }

   export class ErrorBoundary extends Component<Props, State> {
     state: State = { hasError: false };

     static getDerivedStateFromError(error: Error): State {
       return { hasError: true, error };
     }

     componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
       // Log vers Sentry ou autre service
       console.error('ErrorBoundary caught:', error, errorInfo);
     }

     render() {
       if (this.state.hasError) {
         return this.props.fallback;
       }
       return this.props.children;
     }
   }
   ```

2. Créer `core/presentation/components/error-fallback.tsx` - UI de fallback

3. Wrapper l'app dans `app/_layout.tsx`

#### 4.2 Validation des Variables d'Environnement

1. Créer `core/config/env.ts` :
   ```typescript
   import { z } from 'zod';

   const envSchema = z.object({
     EXPO_PUBLIC_SUPABASE_URL: z.string().url(),
     EXPO_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
   });

   export const env = envSchema.parse({
     EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
     EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
   });
   ```

2. Utiliser `env.EXPO_PUBLIC_SUPABASE_URL` au lieu de `process.env.EXPO_PUBLIC_SUPABASE_URL`

3. L'app crashera au démarrage si les env vars sont manquantes (mieux qu'un crash random plus tard)

#### 4.3 Toast / Snackbar

1. Installer un package de toast compatible HeroUI ou créer un custom
2. Créer `core/presentation/hooks/use-toast.ts`
3. Afficher les erreurs API via toast au lieu de `console.error`

#### 4.4 Améliorer les Loading States

Remplacer tous les `return null` pendant le loading :

1. `app/_layout.tsx` - Splash screen ou skeleton
2. `app/(protected)/_layout.tsx` - Skeleton de profile

### Critères de validation

- [ ] L'app affiche un fallback en cas d'erreur critique
- [ ] L'app crash proprement si les env vars manquent
- [ ] Les erreurs API s'affichent via toast
- [ ] Plus aucun `return null` pendant le loading

---

## Phase 5 : Testing

### Objectif

Coverage des hooks et composants critiques.

### Prérequis

- Jest est déjà configuré (`jest-expo`)
- Lire la doc Testing Library : https://testing-library.com/docs/react-native-testing-library/intro/

### Tâches

#### 5.1 Setup Testing Library

```bash
npm install --save-dev @testing-library/react-native @testing-library/jest-native
```

Configurer dans `jest.config.js` ou `package.json`.

#### 5.2 Setup MSW (Mock Service Worker)

```bash
npm install --save-dev msw
```

1. Créer `__tests__/mocks/handlers.ts` avec les mocks Supabase
2. Créer `__tests__/mocks/server.ts`
3. Configurer dans `jest.setup.js`

#### 5.3 Tests Unitaires des Usecases

Créer des tests pour chaque usecase :

```
__tests__/
├── features/
│   ├── auth/
│   │   └── domain/
│   │       └── usecases/
│   │           ├── sign-in.test.ts
│   │           ├── sign-up.test.ts
│   │           └── sign-out.test.ts
│   └── profile/
│       └── domain/
│           └── usecases/
│               ├── fetch-profile.test.ts
│               └── create-profile.test.ts
```

Exemple de test :
```typescript
import { signIn } from '@/features/auth/domain/usecases/sign-in';
import { AuthRepository } from '@/features/auth/domain/repositories/auth-repository';

describe('signIn usecase', () => {
  it('should return session on successful sign in', async () => {
    const mockSession = { accessToken: 'token', user: { id: '1', email: 'test@test.com' } };
    const mockRepository: AuthRepository = {
      signIn: jest.fn().mockResolvedValue(mockSession),
      signUp: jest.fn(),
      signOut: jest.fn(),
      refreshSession: jest.fn(),
      setSession: jest.fn(),
    };

    const result = await signIn(mockRepository)({ email: 'test@test.com', password: 'password' });

    expect(result).toEqual(mockSession);
    expect(mockRepository.signIn).toHaveBeenCalledWith({ email: 'test@test.com', password: 'password' });
  });
});
```

#### 5.4 Tests des Hooks

Créer des tests pour les hooks critiques :

- `use-auth.test.ts`
- `use-authentication.test.ts`
- `use-fetch-profile.test.ts`

Utiliser `@testing-library/react-hooks` ou `renderHook` de Testing Library.

#### 5.5 Tests des Composants

Créer des tests pour les composants UI critiques :

- `button.test.tsx`
- `input.test.tsx`
- `form-input.test.tsx`

#### 5.6 Hook Pre-commit

Ajouter les tests au pre-commit hook `.husky/pre-commit` :
```bash
npm run lint
npm test -- --watchAll=false --passWithNoTests
```

### Critères de validation

- [ ] Tous les usecases ont des tests
- [ ] Les hooks critiques ont des tests
- [ ] `npm test` passe
- [ ] Le pre-commit exécute les tests

---

## Phase 6 : Scripts Modulaires + CI/CD

### Objectif

Permettre de customiser la boilerplate via scripts et automatiser le déploiement.

### Tâches

#### 6.1 Script Engine

Créer `scripts/utils/` avec des utilitaires communs :

1. `file-utils.ts` - Lecture/écriture/suppression de fichiers
2. `package-utils.ts` - Manipulation du package.json
3. `import-utils.ts` - Analyse et modification des imports

#### 6.2 Script `remove:feature`

Créer `scripts/remove-feature.ts` :

```bash
npm run remove:feature auth
```

Ce script doit :
1. Supprimer `features/auth/`
2. Supprimer les routes liées dans `app/`
3. Supprimer les imports cassés
4. Mettre à jour `app/_layout.tsx` pour retirer les guards auth
5. Supprimer les dépendances inutilisées du `package.json`

#### 6.3 Script `remove:supabase`

Créer `scripts/remove-supabase.ts` :

```bash
npm run remove:supabase
```

Ce script doit :
1. Supprimer `infrastructure/supabase/`
2. Supprimer tous les fichiers `supabase-*-repository.ts` dans features
3. Désinstaller `@supabase/supabase-js`
4. Créer des fichiers repository placeholder (interface vide avec TODO)
5. Afficher les instructions pour implémenter un autre backend

#### 6.4 Script `add:custom-api`

Créer `scripts/add-custom-api.ts` :

```bash
npm run add:custom-api
```

Ce script doit :
1. Créer `infrastructure/api/client.ts` avec un client HTTP (fetch ou axios)
2. Créer des templates de repository pour custom API
3. Mettre à jour les imports

#### 6.5 Script `setup:minimal`

Créer `scripts/setup-minimal.ts` :

```bash
npm run setup:minimal
```

Ce script doit :
1. Supprimer `features/auth/`, `features/profile/`, `features/onboarding/`
2. Supprimer toutes les routes sauf une page d'accueil basique
3. Nettoyer l'app pour avoir juste navigation + UI

#### 6.6 Ajouter les scripts au package.json

```json
{
  "scripts": {
    "remove:feature": "npx tsx scripts/remove-feature.ts",
    "remove:supabase": "npx tsx scripts/remove-supabase.ts",
    "add:custom-api": "npx tsx scripts/add-custom-api.ts",
    "setup:minimal": "npx tsx scripts/setup-minimal.ts"
  }
}
```

#### 6.7 GitHub Actions CI

Créer `.github/workflows/ci.yml` :

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npx tsc --noEmit
      - run: npm test -- --watchAll=false
```

#### 6.8 EAS Workflow

Créer `.eas/workflows/build-and-submit.yml` pour :

1. **Fingerprint check** - Vérifier si un build natif est nécessaire
2. **Build ou OTA** - Build si fingerprint changé, sinon OTA update
3. **Submit** - Soumettre aux stores si sur main

Voir la doc : https://docs.expo.dev/eas/workflows/

### Critères de validation

- [ ] `npm run remove:feature auth` supprime l'auth proprement
- [ ] `npm run remove:supabase` supprime Supabase proprement
- [ ] `npm run setup:minimal` crée un projet minimal fonctionnel
- [ ] GitHub Actions CI passe sur chaque PR
- [ ] EAS Workflow déploie correctement

---

## Ordre d'exécution recommandé

1. **Phase 2** (HeroUI) - Donne une UI moderne rapidement
2. **Phase 3** (Forms) - Améliore la DX immédiatement
3. **Phase 4** (Error Handling) - Quick wins robustesse
4. **Phase 5** (Testing) - Sécurise les refactos
5. **Phase 6** (Scripts + CI/CD) - Automatisation finale

---

## Notes importantes

### Conventions de code

- **Pas de commentaires** dans le code
- **Pas de Co-Authored-By** dans les commits
- **Noms explicites** : `isCloseButtonVisible` plutôt que `isVisible`
- **Mots interdits** : `handle`, `manage`, `process`
- **Une fonction = une responsabilité**
- **Pas de composants nested**

### Avant de coder

- Toujours poser des questions pour clarifier le contexte
- Utiliser les TodoWrite pour tracker les tâches
- Tester avec `npx tsc --noEmit` et `npm run lint` après chaque changement

### Backend

- **Supabase** est le backend par défaut
- **Firebase** n'est PAS supporté (volontairement exclu)
- L'architecture permet d'ajouter un **custom API backend** via le pattern adapter

### Web

- **HeroUI Native ne supporte pas le web** actuellement
- Cette boilerplate est **mobile-first** (iOS/Android)
