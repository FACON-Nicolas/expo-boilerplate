# Troubleshooting

Solutions to common issues you might encounter when using this boilerplate.

## Table of Contents

- [Installation Issues](#installation-issues)
- [Build Failures](#build-failures)
- [Runtime Errors](#runtime-errors)
- [Environment Variables](#environment-variables)
- [Metro Bundler](#metro-bundler)
- [EAS Build](#eas-build)
- [Supabase](#supabase)
- [Testing](#testing)

---

## Installation Issues

### `npm install` fails with peer dependency errors

**Problem:**

```
npm ERR! ERESOLVE could not resolve dependency
npm ERR! peer react@"^18.0.0" from some-package
```

**Solution:**

```bash
# Force install (safe for this boilerplate)
npm install --legacy-peer-deps
```

### Node version mismatch

**Problem:**

```
error This project requires Node.js >= 18
```

**Solution:**

```bash
# Check your Node version
node -v

# Use nvm to switch versions
nvm install 18
nvm use 18
```

### Watchman issues (macOS)

**Problem:**

```
Watchman error: too many open files
```

**Solution:**

```bash
# Increase file limit
echo kern.maxfiles=524288 | sudo tee -a /etc/sysctl.conf
echo kern.maxfilesperproc=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -w kern.maxfiles=524288
sudo sysctl -w kern.maxfilesperproc=524288

# Reset Watchman
watchman watch-del-all
```

---

## Build Failures

### TypeScript errors

**Problem:**

```
error TS2307: Cannot find module '@/features/...'
```

**Solution:**

1. Check `tsconfig.json` has the path alias:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

2. Restart TypeScript server in your IDE

3. Run:

```bash
npx tsc --noEmit
```

### ESLint boundary errors

**Problem:**

```
error  Import violates boundary rule  boundaries/element-types
```

**Solution:**

You're importing across architecture boundaries. Check the [Architecture Guide](./architecture.md) for allowed imports.

Common fixes:
- Domain should not import from data or presentation
- Features should not import from other features' data/presentation layers

### Metro bundler cannot resolve module

**Problem:**

```
Unable to resolve module @sentry/react-native
```

**Solution:**

```bash
# Clear Metro cache
npx expo start --clear

# Or manually
rm -rf node_modules/.cache
rm -rf .expo
npm start -- --clear
```

---

## Runtime Errors

### "Text strings must be rendered within a <Text> component"

**Problem:**

```
Error: Text strings must be rendered within a <Text> component.
```

**Solution:**

Wrap text in the `Text` component from `@/ui/components/text`:

```tsx
// ❌ Wrong
<View>Hello World</View>

// ✅ Correct
import { Text } from '@/ui/components/text';
<View><Text>Hello World</Text></View>
```

### "Cannot read property 'x' of undefined"

**Problem:**

Accessing a property on undefined data.

**Solution:**

Use optional chaining and loading states:

```tsx
// ❌ Wrong
const name = profile.username;

// ✅ Correct
const name = profile?.username;

// ✅ Better - handle loading state
if (isLoading) return <Skeleton />;
if (!profile) return <Text>No profile</Text>;
return <Text>{profile.username}</Text>;
```

### Sentry: "Property 'DOMException' doesn't exist"

**Problem:**

```
ReferenceError: Property 'DOMException' doesn't exist
```

**Solution:**

This was fixed in Phase 8. If you see this, update your `infrastructure/monitoring/sentry/filters.ts` to not use `DOMException` (it doesn't exist in React Native/Hermes).

---

## Environment Variables

### Variables not loading

**Problem:**

`env.EXPO_PUBLIC_SUPABASE_URL` is undefined.

**Solution:**

1. Check file name is `.env` (not `.env.local` or `.env.development`)

2. Ensure variables are prefixed with `EXPO_PUBLIC_`:

```bash
# ✅ Correct
EXPO_PUBLIC_SUPABASE_URL=https://...

# ❌ Wrong - won't be exposed to the app
SUPABASE_URL=https://...
```

3. Restart Metro bundler:

```bash
npx expo start --clear
```

### "Missing or invalid environment variables"

**Problem:**

```
Error: Missing or invalid environment variables: EXPO_PUBLIC_SUPABASE_URL
```

**Solution:**

1. Copy the example file:

```bash
cp .env.example .env
```

2. Fill in all required values

3. Check `core/config/env.ts` for required variables

---

## Metro Bundler

### "ENOENT: no such file or directory"

**Problem:**

```
Error: ENOENT: no such file or directory, open '.../node_modules/...'
```

**Solution:**

```bash
# Clean install
rm -rf node_modules
rm package-lock.json
npm install
```

### Slow bundling / High CPU usage

**Problem:**

Metro bundler is slow or using too much CPU.

**Solution:**

1. Add to `metro.config.js`:

```js
resolver: {
  blockList: [
    /node_modules\/.*\/node_modules/,
  ],
}
```

2. Close other apps using file watchers

3. On macOS, increase file limits (see Watchman issues above)

### "Cannot find entry file"

**Problem:**

```
Cannot find entry file index.js in any of the roots
```

**Solution:**

1. Check `package.json` has:

```json
{
  "main": "expo-router/entry"
}
```

2. Clear cache:

```bash
npx expo start --clear
```

---

## EAS Build

### Build fails with "Credentials error"

**Problem:**

```
Error: Failed to authenticate with Apple
```

**Solution:**

```bash
# Re-authenticate
eas credentials

# Or reset credentials
eas credentials --platform ios
```

### Build queue takes too long

**Problem:**

Builds stuck in queue for hours.

**Solution:**

1. Check EAS status: [status.expo.dev](https://status.expo.dev)

2. Use local builds for development:

```bash
npx eas build --local --profile development --platform ios
```

### "Fingerprint mismatch"

**Problem:**

OTA update rejected due to fingerprint mismatch.

**Solution:**

This means native code changed. You need a new build:

```bash
npx eas build --profile production --platform all
```

---

## Supabase

### "Invalid API key"

**Problem:**

```
Error: Invalid API key
```

**Solution:**

1. Check you're using the **anon** key, not the **service_role** key
2. Verify the key in Supabase Dashboard > Settings > API
3. Ensure no extra spaces in `.env`

### "User not found" after sign up

**Problem:**

User created but `profiles` table is empty.

**Solution:**

1. Check RLS policies on `profiles` table
2. Ensure the trigger for auto-creating profiles is set up:

```sql
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### Real-time subscriptions not working

**Problem:**

`onAuthStateChange` or real-time data not updating.

**Solution:**

1. Enable Realtime in Supabase Dashboard > Database > Replication
2. Check RLS policies allow SELECT
3. Verify you're subscribed to the correct channel

---

## Testing

### Tests fail with "Cannot find module"

**Problem:**

```
Cannot find module '@/features/...' from 'test.ts'
```

**Solution:**

Check `jest.config.js` has moduleNameMapper:

```js
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/$1',
}
```

### "Warning: An update inside a test was not wrapped in act(...)"

**Problem:**

React state update warning in tests.

**Solution:**

Wrap state updates in `act()` or use `waitFor`:

```tsx
import { act, waitFor } from '@testing-library/react-native';

// Option 1: act()
await act(async () => {
  fireEvent.press(button);
});

// Option 2: waitFor
await waitFor(() => {
  expect(result.current.data).toBeDefined();
});
```

### Mock not working

**Problem:**

Jest mock not being applied.

**Solution:**

1. Check mock is in correct location (`__mocks__/` or `jest.setup.ts`)
2. Ensure mock path matches exactly
3. Clear Jest cache:

```bash
npm test -- --clearCache
```

---

## Still Stuck?

1. **Search existing issues:** [GitHub Issues](https://github.com/your-username/expo-boilerplate/issues)
2. **Check Expo docs:** [docs.expo.dev](https://docs.expo.dev)
3. **Ask on Discord:** [Expo Discord](https://chat.expo.dev)
4. **Open an issue:** Provide error message, steps to reproduce, and environment details
