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
- ✅ **Phase 7 : Scripts Modulaires + CI/CD** - Scripts de scaffolding, GitHub Actions, EAS Workflows

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

---

## Phase 8 : Sentry (Monitoring & Error Tracking)

### Objectif

Intégrer Sentry pour le monitoring complet de l'application : crashes, errors, performance, et source maps.

### Architecture

```
infrastructure/
├── monitoring/
│   └── sentry/
│       ├── client.ts           # Configuration et initialisation Sentry
│       ├── filters.ts          # Filtres d'erreurs (network, cancellations)
│       └── types.ts            # Types Sentry custom
└── supabase/
```

### Tâches

#### 8.1 Installation et configuration de base

1. Installer `@sentry/react-native` et `sentry-expo`
2. Créer `infrastructure/monitoring/sentry/client.ts` avec :
   - Initialisation Sentry avec DSN
   - Configuration des environnements via EAS profiles (development/preview/production)
   - Sample rates : 100% dev, 20% prod pour le performance monitoring
   - Session replay activé
3. Ajouter les variables d'environnement dans `core/config/env.ts` :
   - `SENTRY_DSN` (requis)
   - `SENTRY_ENABLED` (optionnel, défaut: true)

#### 8.2 Intégration ErrorBoundary

1. Modifier `core/presentation/components/error-boundary.tsx` pour :
   - Capturer et envoyer les erreurs à Sentry
   - Enrichir avec le contexte React (component stack)
2. Intégrer `Sentry.ErrorBoundary` ou wrapper custom

#### 8.3 Intégration AppError

1. Créer un mapper `AppError` → Sentry avec :
   - `error.code` → Sentry tag
   - `error.context` → Sentry extra data
   - `error.severity` → Sentry level (error, warning, info)
2. Enrichir automatiquement les breadcrumbs

#### 8.4 Hook useSentryContext

Créer `infrastructure/monitoring/sentry/use-sentry-context.ts` :

```typescript
export const useSentryContext = () => {
  const setUser = (user: SentryUser | null) => { ... };
  const addBreadcrumb = (breadcrumb: Breadcrumb) => { ... };
  const setTag = (key: string, value: string) => { ... };
  const captureException = (error: Error, context?: Record<string, unknown>) => { ... };
  const captureMessage = (message: string, level?: SeverityLevel) => { ... };

  return { setUser, addBreadcrumb, setTag, captureException, captureMessage };
};
```

#### 8.5 Filtrage des erreurs

Créer `infrastructure/monitoring/sentry/filters.ts` pour ignorer :

- Erreurs réseau (`Network request failed`, `Failed to fetch`)
- Annulations utilisateur (`AbortError`, `cancelled`)
- Erreurs de timeout non critiques

#### 8.6 Navigation tracking

1. Intégrer avec Expo Router pour tracker les changements d'écran
2. Créer des transactions automatiques par route
3. Ajouter des breadcrumbs de navigation

#### 8.7 Source maps via EAS

1. Configurer `sentry-expo` plugin dans `app.json`
2. Ajouter les secrets EAS : `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT`
3. Upload automatique des source maps pendant les builds EAS

#### 8.8 Tests

1. Tests unitaires pour `useSentryContext`
2. Tests des filtres d'erreurs
3. Mock Sentry dans `jest.setup.ts`

### Variables d'environnement

```bash
# .env
SENTRY_DSN=https://xxx@sentry.io/xxx
SENTRY_ENABLED=true  # Optionnel, pour désactiver en local ou GDPR

# EAS Secrets (via eas secret:create)
SENTRY_AUTH_TOKEN=xxx
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project
```

### Critères de validation

- [ ] Les crashes natifs sont capturés et visibles dans Sentry
- [ ] Les erreurs JS sont capturées avec stack trace
- [ ] Les AppError sont enrichies avec code et context
- [ ] Le performance monitoring fonctionne (transactions visibles)
- [ ] Les source maps sont uploadées et les stack traces sont lisibles
- [ ] La navigation est trackée (breadcrumbs et transactions)
- [ ] Les erreurs réseau sont filtrées
- [ ] `SENTRY_ENABLED=false` désactive complètement Sentry
- [ ] Les tests passent

---

## Phase 9 : Documentation

### Objectif

Créer une documentation complète et maintenable pour faciliter l'onboarding et l'utilisation du boilerplate.

### Structure

```
expo-boilerplate/
├── README.md                    # Overview, quick start, links to docs
└── docs/
    ├── getting-started.md       # Installation, configuration, first run
    ├── architecture.md          # Clean Architecture, patterns, diagrams
    ├── scripts.md               # npm scripts documentation
    ├── deployment.md            # EAS Build, CI/CD, OTA updates
    └── troubleshooting.md       # FAQ, common issues and solutions
```

### Tâches

#### 9.1 README.md

Refonte du README principal avec :

1. Badges (CI status, Expo SDK, license)
2. Features list avec emojis
3. Quick start (5 étapes max)
4. Screenshots/GIFs de l'app
5. Table of contents vers docs/
6. Contributing guidelines
7. License

#### 9.2 docs/getting-started.md

1. Prerequisites (Node, npm, Expo CLI, EAS CLI)
2. Installation step-by-step
3. Environment variables setup (.env)
4. Running on iOS/Android simulators
5. Running on physical devices
6. First modifications guide

#### 9.3 docs/architecture.md

1. Clean Architecture overview avec diagramme ASCII/Mermaid
2. Folder structure explained
3. Layer dependencies diagram
4. Feature module anatomy
5. Patterns avec code snippets :
   - Usecase pattern (curried functions)
   - Repository pattern (interface + implementation)
   - Hook pattern (React Query integration)
6. Import conventions
7. State management (Zustand vs React Query)

#### 9.4 docs/scripts.md

Documentation de chaque script npm :

1. `npm run add:feature <name>` - Scaffolding de features
2. `npm run remove:feature <name>` - Suppression de features
3. `npm run add:supabase` - Installation backend Supabase
4. `npm run remove:supabase` - Suppression backend Supabase
5. `npm run add:custom-backend` - Installation backend API REST
6. `npm run setup:minimal` - Reset vers projet minimal
7. `npm run init` - Initialisation app Expo/EAS

Pour chaque script :
- Description
- Usage
- Options (--dry-run, --force)
- Examples
- What it modifies

#### 9.5 docs/deployment.md

1. EAS Build setup
2. Build profiles (development, preview, production)
3. EAS Workflows explained
4. Fingerprint strategy (build vs OTA)
5. GitHub Actions CI pipeline
6. Environment secrets management
7. App Store / Play Store submission tips

#### 9.6 docs/troubleshooting.md

1. Common errors and solutions
2. Build failures debugging
3. Environment variables issues
4. Dependency conflicts
5. Metro bundler issues
6. EAS Build issues

### Langue

Toute la documentation en **anglais**.

### Critères de validation

- [ ] README.md est clair et permet un quick start en 5 minutes
- [ ] docs/getting-started.md permet l'installation complète
- [ ] docs/architecture.md explique la Clean Architecture avec diagrammes
- [ ] docs/scripts.md documente tous les scripts avec exemples
- [ ] docs/deployment.md couvre le flow complet de déploiement
- [ ] docs/troubleshooting.md résout les problèmes courants
- [ ] Tous les code snippets sont testés et fonctionnels

---

## Phase 10 : Analytics (Amplitude)

### Objectif

Intégrer un système d'analytics complet avec Amplitude, abstrait pour permettre un changement de provider futur.

### Architecture

```
infrastructure/
└── monitoring/
    ├── sentry/                    # Phase 8
    └── analytics/
        ├── provider.ts            # Interface AnalyticsProvider
        ├── amplitude-provider.ts  # Implémentation Amplitude
        ├── use-analytics.ts       # Hook React
        └── types.ts               # Types d'événements
```

### Tâches

#### 10.1 Interface AnalyticsProvider

Créer `infrastructure/monitoring/analytics/provider.ts` :

```typescript
export interface AnalyticsProvider {
  initialize(apiKey: string): void;
  identify(userId: string, traits?: Record<string, unknown>): void;
  reset(): void;
  track(event: string, properties?: Record<string, unknown>): void;
  screen(name: string, properties?: Record<string, unknown>): void;
  setUserProperties(properties: Record<string, unknown>): void;
}
```

#### 10.2 Implémentation Amplitude

1. Installer `@amplitude/analytics-react-native`
2. Créer `infrastructure/monitoring/analytics/amplitude-provider.ts`
3. Configurer :
   - Auto-tracking des sessions
   - Flush interval optimisé mobile
   - Offline event queuing

#### 10.3 Hook useAnalytics

Créer `infrastructure/monitoring/analytics/use-analytics.ts` :

```typescript
export const useAnalytics = () => {
  const track = (event: string, properties?: Record<string, unknown>) => { ... };
  const screen = (name: string, properties?: Record<string, unknown>) => { ... };
  const identify = (userId: string, traits?: Record<string, unknown>) => { ... };
  const reset = () => { ... };

  return { track, screen, identify, reset };
};
```

#### 10.4 Types d'événements

Créer `infrastructure/monitoring/analytics/types.ts` avec types stricts :

```typescript
type AuthEvent = 'sign_up_started' | 'sign_up_completed' | 'sign_in' | 'sign_out';
type NavigationEvent = 'screen_view';
type UserActionEvent = 'button_pressed' | 'form_submitted';

export type AnalyticsEvent = AuthEvent | NavigationEvent | UserActionEvent;
```

#### 10.5 Navigation tracking

1. Intégrer avec Expo Router pour auto-track les screen views
2. Enrichir avec les paramètres de route
3. Tracker le temps passé sur chaque écran

#### 10.6 Synchronisation avec Sentry

1. Partager le même `userId` entre Analytics et Sentry
2. Créer un hook `useIdentity` qui synchronise les deux
3. Ajouter des breadcrumbs Sentry pour les events analytics importants

#### 10.7 GDPR Compliance

1. Ajouter `ANALYTICS_ENABLED` dans `core/config/env.ts`
2. Créer un système d'opt-out utilisateur persisté
3. Respecter le tracking consent (ATT sur iOS)
4. Pas de tracking si consentement refusé

#### 10.8 Tests

1. Tests unitaires pour `useAnalytics`
2. Tests du provider Amplitude (mocké)
3. Tests de la synchronisation avec Sentry

### Variables d'environnement

```bash
# .env
AMPLITUDE_API_KEY=xxx
ANALYTICS_ENABLED=true  # Optionnel, pour désactiver globalement
```

### Événements standard

| Événement | Propriétés | Quand |
|-----------|------------|-------|
| `sign_up_started` | `method` | Ouverture formulaire inscription |
| `sign_up_completed` | `method`, `userId` | Inscription réussie |
| `sign_in` | `method` | Connexion réussie |
| `sign_out` | - | Déconnexion |
| `screen_view` | `screen_name`, `params` | Changement d'écran |
| `button_pressed` | `button_name`, `screen` | Clic sur bouton important |
| `error_occurred` | `error_code`, `screen` | Erreur affichée à l'utilisateur |

### Critères de validation

- [ ] Amplitude reçoit les événements en temps réel
- [ ] Les screen views sont auto-trackées via Expo Router
- [ ] L'identification utilisateur fonctionne et persiste
- [ ] La synchronisation Sentry fonctionne (même userId)
- [ ] `ANALYTICS_ENABLED=false` désactive complètement le tracking
- [ ] L'opt-out utilisateur fonctionne et est persisté
- [ ] L'abstraction permet de switcher de provider facilement
- [ ] Les tests passent
