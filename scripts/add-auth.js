#!/usr/bin/env node

const logger = require('./utils/logger');
const fileUtils = require('./utils/file-utils');
const templateUtils = require('./utils/template-utils');
const promptUtils = require('./utils/prompt-utils');

const detectBackend = () => {
  if (fileUtils.directoryExists('infrastructure/supabase')) {
    return 'supabase';
  }
  if (fileUtils.directoryExists('infrastructure/api')) {
    return 'custom-api';
  }
  return null;
};

const createAuthDomain = () => {
  fileUtils.ensureDirectory('features/auth/domain/entities');
  fileUtils.ensureDirectory('features/auth/domain/repositories');
  fileUtils.ensureDirectory('features/auth/domain/usecases');
  fileUtils.ensureDirectory('features/auth/domain/validation');

  const sessionEntity = `export interface User {
  id: string;
  email: string;
}

export interface Session {
  accessToken: string;
  refreshToken: string;
  expiresAt?: number;
  user: User;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
}
`;
  fileUtils.writeFile('features/auth/domain/entities/session.ts', sessionEntity);

  const authRepository = `import type { Session, SignInCredentials, SignUpCredentials } from '@/features/auth/domain/entities/session';

export interface AuthRepository {
  signIn(credentials: SignInCredentials): Promise<Session>;
  signUp(credentials: SignUpCredentials): Promise<Session>;
  signOut(): Promise<void>;
  refreshSession(): Promise<Session>;
  setSession(session: Session): Promise<Session>;
}
`;
  fileUtils.writeFile('features/auth/domain/repositories/auth-repository.ts', authRepository);

  const authSchema = `import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
`;
  fileUtils.writeFile('features/auth/domain/validation/auth-schema.ts', authSchema);

  const signInUsecase = `import type { AuthRepository } from '@/features/auth/domain/repositories/auth-repository';
import type { Session, SignInCredentials } from '@/features/auth/domain/entities/session';

export const signIn =
  (repository: AuthRepository) =>
  async (credentials: SignInCredentials): Promise<Session> => {
    return repository.signIn(credentials);
  };
`;
  fileUtils.writeFile('features/auth/domain/usecases/sign-in.ts', signInUsecase);

  const signUpUsecase = `import type { AuthRepository } from '@/features/auth/domain/repositories/auth-repository';
import type { Session, SignUpCredentials } from '@/features/auth/domain/entities/session';

export const signUp =
  (repository: AuthRepository) =>
  async (credentials: SignUpCredentials): Promise<Session> => {
    return repository.signUp(credentials);
  };
`;
  fileUtils.writeFile('features/auth/domain/usecases/sign-up.ts', signUpUsecase);

  const signOutUsecase = `import type { AuthRepository } from '@/features/auth/domain/repositories/auth-repository';

export const signOut =
  (repository: AuthRepository) =>
  async (): Promise<void> => {
    return repository.signOut();
  };
`;
  fileUtils.writeFile('features/auth/domain/usecases/sign-out.ts', signOutUsecase);

  const refreshSessionUsecase = `import type { AuthRepository } from '@/features/auth/domain/repositories/auth-repository';
import type { Session } from '@/features/auth/domain/entities/session';

export const refreshSession =
  (repository: AuthRepository) =>
  async (): Promise<Session> => {
    return repository.refreshSession();
  };
`;
  fileUtils.writeFile('features/auth/domain/usecases/refresh-session.ts', refreshSessionUsecase);
};

const createAuthPresentation = () => {
  fileUtils.ensureDirectory('features/auth/presentation/store');
  fileUtils.ensureDirectory('features/auth/presentation/hooks');

  const authStore = `import { create } from 'zustand';

import type { Session } from '@/features/auth/domain/entities/session';

interface AuthState {
  session: Session | null;
  isLoading: boolean;
  setSession: (session: Session | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  isLoading: true,
  setSession: (session) => set({ session, isLoading: false }),
  setIsLoading: (isLoading) => set({ isLoading }),
  clearSession: () => set({ session: null, isLoading: false }),
}));
`;
  fileUtils.writeFile('features/auth/presentation/store/auth-store.ts', authStore);

  const useAuth = `import { useAuthStore } from '@/features/auth/presentation/store/auth-store';

export const useAuth = () => {
  const session = useAuthStore((state) => state.session);
  const isLoading = useAuthStore((state) => state.isLoading);
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);

  return {
    session,
    user: session?.user ?? null,
    isLoading,
    isAuthenticated: !!session,
    setSession,
    clearSession,
  };
};
`;
  fileUtils.writeFile('features/auth/presentation/hooks/use-auth.ts', useAuth);

  const useAuthentication = `import { useAuth } from '@/features/auth/presentation/hooks/use-auth';

export const useAuthentication = () => {
  const { isAuthenticated, isLoading } = useAuth();

  return {
    isUserAuthenticated: isAuthenticated,
    isAuthenticationLoading: isLoading,
  };
};
`;
  fileUtils.writeFile('features/auth/presentation/hooks/use-authentication.ts', useAuthentication);
};

const createRepository = (backend) => {
  fileUtils.ensureDirectory('features/auth/data/repositories');

  if (backend === 'supabase') {
    templateUtils.generateFromTemplate(
      'backend/supabase/auth-repository.ts.template',
      'features/auth/data/repositories/supabase-auth-repository.ts'
    );
  } else if (backend === 'custom-api') {
    templateUtils.generateFromTemplate(
      'backend/custom-api/auth-repository.ts.template',
      'features/auth/data/repositories/api-auth-repository.ts'
    );
  } else {
    const placeholder = `import type { AuthRepository } from '@/features/auth/domain/repositories/auth-repository';

export const createPlaceholderAuthRepository = (): AuthRepository => ({
  signIn: async () => {
    throw new Error('Not implemented - configure a backend first');
  },
  signUp: async () => {
    throw new Error('Not implemented - configure a backend first');
  },
  signOut: async () => {
    throw new Error('Not implemented - configure a backend first');
  },
  refreshSession: async () => {
    throw new Error('Not implemented - configure a backend first');
  },
  setSession: async () => {
    throw new Error('Not implemented - configure a backend first');
  },
});
`;
    fileUtils.writeFile('features/auth/data/repositories/placeholder-auth-repository.ts', placeholder);
  }
};

const createPublicRoutes = () => {
  fileUtils.ensureDirectory('app/(public)');

  const publicLayout = `import { Stack } from 'expo-router';

export default function PublicLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
`;
  fileUtils.writeFile('app/(public)/_layout.tsx', publicLayout);

  const signInPage = `import { View } from '@/ui/components/view';
import { Text } from '@/ui/components/text';

export default function SignInScreen() {
  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text className="text-2xl font-bold mb-4">Sign In</Text>
    </View>
  );
}
`;
  fileUtils.writeFile('app/(public)/index.tsx', signInPage);

  const signUpPage = `import { View } from '@/ui/components/view';
import { Text } from '@/ui/components/text';

export default function SignUpScreen() {
  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text className="text-2xl font-bold mb-4">Sign Up</Text>
    </View>
  );
}
`;
  fileUtils.writeFile('app/(public)/sign-up.tsx', signUpPage);
};

const createTestStructure = () => {
  fileUtils.ensureDirectory('__tests__/features/auth/domain/usecases');
  fileUtils.ensureDirectory('__tests__/features/auth/presentation/hooks');
  fileUtils.writeFile('__tests__/features/auth/domain/usecases/.gitkeep', '');
  fileUtils.writeFile('__tests__/features/auth/presentation/hooks/.gitkeep', '');
};

const run = async () => {
  logger.header('Add Authentication Feature');

  if (fileUtils.directoryExists('features/auth')) {
    logger.warning('Auth feature already exists');
    const shouldOverwrite = await promptUtils.confirm('Do you want to overwrite it?');
    if (!shouldOverwrite) {
      logger.info('Operation cancelled');
      process.exit(0);
    }
    fileUtils.deleteDirectory('features/auth');
    fileUtils.deleteDirectory('__tests__/features/auth');
  }

  const backend = detectBackend();
  if (!backend) {
    logger.warning('No backend detected. A placeholder repository will be created.');
    logger.info('Run npm run add:supabase or npm run add:custom-backend first for full functionality.');
  } else {
    logger.info(`Detected backend: ${backend}`);
  }

  if (!promptUtils.isForceMode()) {
    const confirmed = await promptUtils.confirm('Proceed with auth feature installation?');
    if (!confirmed) {
      logger.info('Operation cancelled');
      process.exit(0);
    }
  }

  const totalSteps = 5;
  let currentStep = 0;

  logger.step(++currentStep, totalSteps, 'Creating domain layer');
  createAuthDomain();

  logger.step(++currentStep, totalSteps, 'Creating data layer');
  createRepository(backend);

  logger.step(++currentStep, totalSteps, 'Creating presentation layer');
  createAuthPresentation();

  logger.step(++currentStep, totalSteps, 'Creating public routes');
  createPublicRoutes();

  logger.step(++currentStep, totalSteps, 'Creating test structure');
  createTestStructure();

  logger.divider();
  logger.success('Auth feature has been added successfully!');
  logger.divider();
  logger.info('Next steps:');
  logger.list([
    'Update app/_layout.tsx to use useAuthentication hook',
    'Implement sign in/sign up forms in app/(public)/',
    'Configure your backend repository if needed',
    'Add session persistence with SecureStore',
  ]);
};

run().catch((error) => {
  logger.error(`Failed: ${error.message}`);
  process.exit(1);
});
