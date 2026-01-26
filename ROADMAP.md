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
- ✅ **Phase 8 : Sentry** - Error tracking, performance monitoring, Session Replay, navigation tracking
- ✅ **Phase 9 : Documentation** - README, Getting Started, Architecture, Scripts, Deployment, Troubleshooting

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
│   ├── monitoring/
│   │   └── sentry/
│   │       ├── client.ts             # Initialisation + navigation integration
│   │       ├── filters.ts            # beforeSend filters (network, abort)
│   │       ├── types.ts              # SentryUser, SentryBreadcrumb, severity mapping
│   │       ├── app-error-reporter.ts # AppError → Sentry mapper
│   │       └── use-sentry-context.ts # Hook React
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

## ✅ Phase 8 : Sentry (Monitoring & Error Tracking) - TERMINÉE

### Réalisé

- ✅ Installation `@sentry/react-native` avec plugin Expo
- ✅ Configuration complète dans `infrastructure/monitoring/sentry/`
- ✅ Mapping intelligent `AppError` → Sentry (severity par code)
- ✅ Filtres `beforeSend` (network, timeout, abort errors)
- ✅ Session Replay avec masquage total (GDPR)
- ✅ Navigation tracking avec Expo Router
- ✅ Hook `useSentryContext` pour React
- ✅ Intégration ErrorBoundary avec componentStack
- ✅ `Sentry.wrap()` sur RootLayout
- ✅ 29 tests unitaires
- ✅ Variables env : `EXPO_PUBLIC_SENTRY_DSN`, `EXPO_PUBLIC_SENTRY_ENABLED`

### Configuration source maps (pour production)

```bash
# EAS Secrets (optionnel, pour source maps lisibles en prod)
eas secret:create --name SENTRY_AUTH_TOKEN --value "xxx"
eas secret:create --name SENTRY_ORG --value "your-org"
eas secret:create --name SENTRY_PROJECT --value "expo-boilerplate"
```

---

## ✅ Phase 9 : Documentation - TERMINÉE

### Réalisé

Documentation complète en anglais :

- ✅ **README.md** - Badges, features, quick start, architecture overview, scripts, contributing
- ✅ **docs/getting-started.md** - Prerequisites, installation, env setup, running on simulators
- ✅ **docs/architecture.md** - Clean Architecture diagrams, layer rules, patterns (usecase, repository), import conventions
- ✅ **docs/scripts.md** - All scaffolding scripts documented with options and examples
- ✅ **docs/deployment.md** - EAS Build profiles, CI/CD, fingerprint strategy, App Store submission
- ✅ **docs/troubleshooting.md** - Common issues (installation, build, runtime, Metro, Supabase, testing)

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
