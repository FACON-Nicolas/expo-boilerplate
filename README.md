# Expo Boilerplate

<div align="center">

![Expo](https://img.shields.io/badge/Expo-54-000020?style=for-the-badge&logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**A production-ready, modular, and strictly typed Expo boilerplate with Clean Architecture.**

[Getting Started](#-quick-start) · [Documentation](#-documentation) · [Features](#-features) · [Architecture](#-architecture)

</div>

---

## ✨ Features

| Category | Technologies |
|----------|--------------|
| 🏗️ **Architecture** | Clean Architecture, Feature-Based, Strict ESLint Boundaries |
| 📱 **Framework** | Expo SDK 54, React Native 0.81, New Architecture |
| 🧭 **Navigation** | Expo Router 6 (file-based routing) |
| 🎨 **UI** | HeroUI Native, Uniwind (Tailwind CSS v4) |
| 📝 **Forms** | React Hook Form + Zod validation |
| 🔐 **Auth** | Supabase Auth (ready to use) |
| 📊 **State** | Zustand (client) + React Query (server) |
| 🔍 **Monitoring** | Sentry (errors, performance, session replay) |
| 🌍 **i18n** | i18next (EN/FR included) |
| 🧪 **Testing** | Jest + Testing Library + MSW (120+ tests) |
| 🚀 **CI/CD** | GitHub Actions + EAS Workflows |
| 📜 **Scripts** | Feature scaffolding, backend management |

---

## 🚀 Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/your-username/expo-boilerplate.git my-app
cd my-app

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your Supabase credentials

# 4. Run the app
npm run ios     # iOS Simulator
npm run android # Android Emulator
```

> 📖 For detailed setup instructions, see [Getting Started](./docs/getting-started.md)

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [Getting Started](./docs/getting-started.md) | Installation, configuration, first run |
| [Architecture](./docs/architecture.md) | Clean Architecture, patterns, layer rules |
| [Scripts](./docs/scripts.md) | Feature scaffolding, backend management |
| [Deployment](./docs/deployment.md) | EAS Build, CI/CD, App Store submission |
| [Troubleshooting](./docs/troubleshooting.md) | Common issues and solutions |

---

## 🏛️ Architecture

This boilerplate implements **Clean Architecture** with strict layer separation:

```
┌─────────────────────────────────────────────────────────────┐
│                      PRESENTATION                            │
│         app/ (routes) + ui/ (components)                    │
│              + features/*/presentation/                      │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────┼───────────────────────────────────┐
│                       DOMAIN                                 │
│              features/*/domain/                              │
│    (entities, repositories interfaces, usecases)            │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────┼───────────────────────────────────┐
│                        DATA                                  │
│              features/*/data/                                │
│         (repository implementations)                         │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────┼───────────────────────────────────┐
│                   INFRASTRUCTURE                             │
│         infrastructure/ (supabase, sentry, etc.)            │
└─────────────────────────────────────────────────────────────┘
```

**Key Principles:**
- 📦 **Domain is pure** - No external dependencies
- 🔌 **Dependency Injection** - Repositories are injected into usecases
- 🚧 **Boundaries enforced** - ESLint prevents invalid imports
- 📁 **Feature-based** - Each feature is self-contained

> 📖 See [Architecture Guide](./docs/architecture.md) for details

---

## 📂 Project Structure

```
expo-boilerplate/
├── app/                    # Expo Router (screens)
│   ├── (public)/          # Non-authenticated routes
│   └── (protected)/       # Authenticated routes
├── features/              # Feature modules
│   ├── auth/              # Authentication
│   │   ├── domain/        # Business logic
│   │   ├── data/          # Implementations
│   │   └── presentation/  # Hooks & stores
│   └── profile/           # User profile
├── core/                  # Shared code
│   ├── config/            # App configuration
│   ├── domain/            # Shared domain (errors)
│   └── presentation/      # Shared components
├── infrastructure/        # External services
│   ├── monitoring/        # Sentry
│   └── supabase/          # Supabase client
├── ui/                    # Design system
│   ├── components/        # UI components
│   └── theme/             # Theme tokens
├── i18n/                  # Translations
├── scripts/               # Scaffolding scripts
└── docs/                  # Documentation
```

---

## 🛠️ Available Scripts

### Development

```bash
npm start          # Start Expo dev server
npm run ios        # Run on iOS simulator
npm run android    # Run on Android emulator
npm test           # Run tests
npm run lint       # Check code quality
```

### Scaffolding

```bash
npm run add:feature <name>      # Create a new feature
npm run remove:feature <name>   # Remove a feature
npm run add:supabase            # Add Supabase backend
npm run add:custom-backend      # Add custom REST API
npm run setup:minimal           # Reset to minimal state
```

> 📖 See [Scripts Documentation](./docs/scripts.md) for all options

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific tests
npm test -- --testPathPattern="auth"
```

**Coverage Requirements:**
- Usecases: 100%
- Hooks: 100%
- Components: Best effort

---

## 🚀 Deployment

### Development Build

```bash
npx eas build --profile development --platform ios
```

### Production Build

```bash
npx eas build --profile production --platform all
```

### OTA Update

```bash
npx eas update --branch production --message "Fix: description"
```

> 📖 See [Deployment Guide](./docs/deployment.md) for full CI/CD setup

---

## 🔧 Configuration

### Environment Variables

```bash
# .env
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key

# Optional
EXPO_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
EXPO_PUBLIC_SENTRY_ENABLED=true
```

### EAS Secrets (for production)

```bash
eas secret:create --name SENTRY_AUTH_TOKEN --value "xxx"
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: resolve bug
docs: update documentation
refactor: code improvement
test: add tests
chore: maintenance
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ using [Expo](https://expo.dev)**

</div>
