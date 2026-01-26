# Expo Boilerplate v2 - Roadmap de Refonte

## Contexte

Cette boilerplate est en cours de refonte pour devenir une base **modulaire**, **scriptable** et **production-ready** permettant de lancer un nouveau projet mobile rapidement.

### Ce qui a été fait

- ✅ **Phase 1 : Clean Architecture + Feature-Based** - Structure migrée
- ✅ **Upgrade Expo 53 → 54** - SDK 54, React 19.1, React Native 0.81.5, Reanimated v4
- ✅ **Phase 2 : HeroUI Native + Design System** - Migration complète
- ✅ **Phase 3 : Forms & Validation** - React Hook Form + Zod intégrés
- ✅ **Phase 4 : Configuration ESLint Stricte** - Règles strictes + boundaries Clean Architecture
- ✅ **Phase 5 : Error Handling & Config** - Error Boundary, validation env, toast, splash gate
- ✅ **Phase 6 : Testing** - 91 tests, coverage 100% usecases/hooks, MSW configuré

### Structure actuelle

```
expo-boilerplate/
├── app/                              # Expo Router (Presentation Layer)
│   ├── _layout.tsx
│   ├── (public)/                     # Routes non authentifiées
│   └── (protected)/                  # Routes authentifiées
│       └── (tabs)/                   # Navigation tabs
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
│   └── profile/
│       ├── domain/
│       │   ├── entities/profile.ts
│       │   ├── repositories/profile-repository.ts
│       │   ├── usecases/fetch-profile.ts, create-profile.ts
│       │   └── validation/profile-schema.ts
│       ├── data/
│       │   └── repositories/supabase-profile-repository.ts
│       └── presentation/
│           └── hooks/use-fetch-profile.ts, use-create-profile.ts
│
├── core/                             # Shared Domain
│   ├── config/
│   │   ├── env.ts                    # Validation des env vars (Zod)
│   │   └── query-client.ts           # Configuration React Query
│   ├── domain/
│   │   ├── errors/app-error.ts
│   │   └── validation/validator.ts
│   ├── data/
│   │   └── storage/secure-storage.ts
│   └── presentation/
│       ├── components/
│       │   ├── error-boundary.tsx    # Error boundary global
│       │   ├── error-fallback.tsx    # UI de fallback
│       │   └── splash-gate.tsx       # Gestion splash + hydration
│       └── hooks/
│           ├── use-toggle.ts
│           ├── use-theme-sync.ts     # Sync Uniwind ↔ theme store
│           └── use-app-toast.ts      # Toast avec support AppError
│
├── infrastructure/                   # External Dependencies
│   └── supabase/client.ts
│
├── ui/                               # Design System
│   ├── components/                   # Composants UI (Button, Input, Text, etc.)
│   │   └── form/                     # Composants de formulaire (FormTextField, FormRadioGroup)
│   └── theme/                        # Tokens et theme store
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
export const signIn =
  (repository: AuthRepository) =>
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
import { AppError } from "@/core/domain/errors/app-error";
import { useAuth } from "@/features/auth/presentation/hooks/use-auth";

// ❌ Éviter
import { AppError } from "@/core";
```

---

## ~~Phase 2 : HeroUI Native + Design System~~ ✅

> **Complétée** - Migration vers HeroUI Native + Uniwind (Tailwind v4) terminée.
>
> - Uniwind configuré avec `global.css` et Metro
> - HeroUI Native avec `HeroUINativeProvider`
> - Design tokens définis (colors, spacing, typography, radius)
> - Composants migrés dans `ui/components/` (Button, Input, Text, View, Link, SafeAreaView, Skeleton, Icon, TabBarIcon)
> - Theme store Zustand avec persistance (`ui/theme/theme-store.ts`)
> - Anciens composants `themed-*.tsx` et `Colors.ts` supprimés

---

## ~~Phase 3 : Forms & Validation (React Hook Form)~~ ✅

> **Complétée** - React Hook Form + Zod intégrés pour la gestion des formulaires.
>
> - `react-hook-form` et `@hookform/resolvers` installés
> - Composants créés dans `ui/components/form/` :
>   - `form-text-field.tsx` - Input connecté à RHF via Controller
>   - `form-radio-group.tsx` - RadioGroup connecté à RHF
> - Écrans migrés vers RHF :
>   - Login (`app/(public)/index.tsx`) avec `zodResolver(signInSchema)`
>   - Sign Up (`app/(public)/sign-up.tsx`) avec `zodResolver(signUpSchema)`
> - Validation Zod en temps réel avec messages d'erreur i18n
> - Onboarding supprimé (flow simplifié)

---

## ~~Phase 4 : Configuration ESLint Stricte~~ ✅

> **Complétée** - Configuration ESLint production-ready avec règles strictes.
>
> **Plugins installés** :
>
> - `eslint-plugin-boundaries` - Règles Clean Architecture entre layers
> - `eslint-plugin-import` - Organisation et validation des imports
> - `eslint-plugin-no-relative-import-paths` - Forcer `@/` alias
> - `@typescript-eslint/eslint-plugin` - Règles TypeScript strictes
> - `lint-staged` - Lint uniquement les fichiers modifiés
>
> **Règles configurées** :
>
> - ✅ Imports relatifs (`./`, `../`) bloqués
> - ✅ `require()` bloqué
> - ✅ Naming convention : `handle*`, `manage*`, `process*` bloqués
> - ✅ Boundaries Clean Architecture :
>   - `feature-domain` → `[feature-domain, core-domain]` ✅
>   - `feature-domain` → `[feature-data, infrastructure]` ❌
>   - `feature-data` → `[feature-domain, core-domain, infrastructure]` ✅
> - ✅ `import/order` avec alphabétisation automatique
> - ✅ `consistent-type-imports` pour les imports de types
>
> **Hooks configurés** :
>
> - `.husky/pre-commit` → `npx lint-staged`
> - `.claude/settings.local.json` → Hook "Stop" avec lint
>
> **Correction pré-requise** : `validator.ts` déplacé de `core/data/` vers `core/domain/` pour respecter Clean Architecture

---

## ~~Phase 5 : Error Handling & Config~~ ✅

> **Complétée** - Error handling global et validation de configuration en place.
>
> **Fichiers créés** :
>
> - `core/config/env.ts` - Validation Zod des variables d'environnement (fail-fast au boot)
> - `core/config/query-client.ts` - Configuration React Query isolée avec retry logic
> - `core/presentation/components/error-boundary.tsx` - Class component pour capturer les erreurs React
> - `core/presentation/components/error-fallback.tsx` - UI de fallback avec bouton retry
> - `core/presentation/components/splash-gate.tsx` - Wrapper qui gère splash screen + hydration
> - `core/presentation/hooks/use-theme-sync.ts` - Synchronisation Uniwind ↔ theme store
> - `core/presentation/hooks/use-app-toast.ts` - Hook toast avec support AppError et i18n
>
> **Fichiers modifiés** :
>
> - `app/_layout.tsx` - Simplifié à 47 lignes, composition de providers uniquement
> - `infrastructure/supabase/client.ts` - Utilise `env` validé
> - `i18n/en.json` et `i18n/fr.json` - Clés errorBoundary, toast, errors.api
> - `.env.example` - ANON_KEY → PUBLISHABLE_KEY
> - `.eslintrc.js` - Ajout types `core-config` dans boundaries
>
> **Architecture SRP respectée** :
>
> - `SplashGate` gère uniquement le splash + hydration
> - `useThemeSync` gère uniquement la sync Uniwind
> - `queryClient` encapsule toute la config React Query
> - `RootLayout` ne fait que composer les providers
>
> **Critères validés** :
>
> - ✅ L'app affiche un fallback en cas d'erreur critique
> - ✅ L'app crash proprement si les env vars manquent
> - ✅ Les erreurs API peuvent s'afficher via `useAppToast`
> - ✅ Splash screen couvre le loading (plus de flash blanc)

---

## ~~Phase 6 : Testing~~ ✅

> **Complétée** - Infrastructure de tests complète avec coverage 100% sur les usecases et hooks.
>
> **Stack de tests** :
>
> - `jest-expo` - Preset Jest pour Expo
> - `@testing-library/react-native` - Testing behavior-driven
> - `msw` - Mock Service Worker (disponible pour tests d'intégration)
>
> **Tests créés** (91 tests, 16 suites) :
>
> - Usecases auth : `sign-in`, `sign-up`, `sign-out`, `refresh-session`
> - Usecases profile : `fetch-profile`, `create-profile`
> - Hooks auth : `use-auth`, `use-authentication`
> - Hooks profile : `use-fetch-profile`, `use-create-profile`
> - Store : `auth-store`
> - Composants UI : `button`, `input`, `text`, `form-text-field`, `form-radio-group`
>
> **Configuration** :
>
> - `jest.config.js` - Coverage 100% sur usecases, MSW dans transformIgnorePatterns
> - `jest.setup.ts` - Mocks i18n, react-i18next, expo-secure-store
> - `__tests__/mocks/handlers.ts` - Handlers MSW pour Supabase auth et profiles
> - `__tests__/mocks/server.ts` - Serveur MSW configuré
> - `__tests__/mocks/msw-setup.ts` - Setup réutilisable pour tests d'intégration
>
> **Hooks configurés** :
>
> - `.husky/pre-commit` exécute les tests avant chaque commit
>
> **Critères validés** :
>
> - ✅ Tous les usecases ont des tests (coverage 100%)
> - ✅ Les hooks critiques ont des tests (coverage 100%)
> - ✅ `npm test` passe (91 tests)
> - ✅ Le pre-commit exécute les tests

---

## Phase 7 : Scripts Modulaires + CI/CD

### Objectif

Permettre de customiser la boilerplate via scripts et automatiser le déploiement.

### Tâches

#### 7.1 Script Engine

Créer `scripts/utils/` avec des utilitaires communs :

1. `file-utils.ts` - Lecture/écriture/suppression de fichiers
2. `package-utils.ts` - Manipulation du package.json
3. `import-utils.ts` - Analyse et modification des imports

#### 7.2 Script `remove:feature`

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

#### 7.3 Script `remove:supabase`

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

#### 7.4 Script `add:custom-api`

Créer `scripts/add-custom-api.ts` :

```bash
npm run add:custom-api
```

Ce script doit :

1. Créer `infrastructure/api/client.ts` avec un client HTTP (axios)
2. Créer des templates de repository pour custom API
3. Mettre à jour les imports

#### 7.5 Script `setup:minimal`

Créer `scripts/setup-minimal.ts` :

```bash
npm run setup:minimal
```

Ce script doit :

1. Supprimer `features/auth/`, `features/profile/`, `features/onboarding/`
2. Supprimer toutes les routes sauf une page d'accueil basique
3. Nettoyer l'app pour avoir juste navigation + UI

#### 7.6 Ajouter les scripts au package.json

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

#### 7.7 GitHub Actions CI

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
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm run lint
      - run: npx tsc --noEmit
      - run: npm test -- --watchAll=false
```

#### 7.8 EAS Workflow

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

1. ~~**Phase 2** (HeroUI) - Donne une UI moderne rapidement~~ ✅
2. ~~**Phase 3** (Forms) - Améliore la DX immédiatement~~ ✅
3. ~~**Phase 4** (ESLint Strict) - Qualité de code dès maintenant~~ ✅
4. ~~**Phase 5** (Error Handling) - Quick wins robustesse~~ ✅
5. ~~**Phase 6** (Testing) - Sécurise les refactos~~ ✅
6. **Phase 7** (Scripts + CI/CD) - Automatisation finale

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
