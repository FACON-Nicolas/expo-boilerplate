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

const checkAuthInstalled = () => {
  return fileUtils.directoryExists('features/auth');
};

const createProfileDomain = () => {
  fileUtils.ensureDirectory('features/profile/domain/entities');
  fileUtils.ensureDirectory('features/profile/domain/repositories');
  fileUtils.ensureDirectory('features/profile/domain/usecases');
  fileUtils.ensureDirectory('features/profile/domain/validation');

  const profileEntity = `export interface Profile {
  id: string;
  userId: string;
  displayName: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProfileInput {
  userId: string;
  displayName?: string;
  avatarUrl?: string;
}
`;
  fileUtils.writeFile('features/profile/domain/entities/profile.ts', profileEntity);

  const profileRepository = `import type { Profile, CreateProfileInput } from '@/features/profile/domain/entities/profile';

export interface ProfileRepository {
  fetchProfile(userId: string): Promise<Profile | null>;
  createProfile(input: CreateProfileInput): Promise<Profile>;
  updateProfile(userId: string, input: Partial<CreateProfileInput>): Promise<Profile>;
}
`;
  fileUtils.writeFile('features/profile/domain/repositories/profile-repository.ts', profileRepository);

  const profileSchema = `import { z } from 'zod';

export const profileSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  displayName: z.string().nullable(),
  avatarUrl: z.string().url().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const createProfileSchema = z.object({
  userId: z.string().uuid(),
  displayName: z.string().min(2).max(50).optional(),
  avatarUrl: z.string().url().optional(),
});

export const updateProfileSchema = z.object({
  displayName: z.string().min(2).max(50).optional(),
  avatarUrl: z.string().url().optional(),
});

export type ProfileValidated = z.infer<typeof profileSchema>;
export type CreateProfileValidated = z.infer<typeof createProfileSchema>;
export type UpdateProfileValidated = z.infer<typeof updateProfileSchema>;
`;
  fileUtils.writeFile('features/profile/domain/validation/profile-schema.ts', profileSchema);

  const fetchProfileUsecase = `import type { ProfileRepository } from '@/features/profile/domain/repositories/profile-repository';
import type { Profile } from '@/features/profile/domain/entities/profile';

export const fetchProfile =
  (repository: ProfileRepository) =>
  async (userId: string): Promise<Profile | null> => {
    return repository.fetchProfile(userId);
  };
`;
  fileUtils.writeFile('features/profile/domain/usecases/fetch-profile.ts', fetchProfileUsecase);

  const createProfileUsecase = `import type { ProfileRepository } from '@/features/profile/domain/repositories/profile-repository';
import type { Profile, CreateProfileInput } from '@/features/profile/domain/entities/profile';

export const createProfile =
  (repository: ProfileRepository) =>
  async (input: CreateProfileInput): Promise<Profile> => {
    return repository.createProfile(input);
  };
`;
  fileUtils.writeFile('features/profile/domain/usecases/create-profile.ts', createProfileUsecase);
};

const createProfilePresentation = () => {
  fileUtils.ensureDirectory('features/profile/presentation/hooks');

  const useFetchProfile = `import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/features/auth/presentation/hooks/use-auth';

export const useFetchProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      throw new Error('Not implemented - inject repository');
    },
    enabled: !!user?.id,
  });
};
`;
  fileUtils.writeFile('features/profile/presentation/hooks/use-fetch-profile.ts', useFetchProfile);

  const useCreateProfile = `import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { CreateProfileInput } from '@/features/profile/domain/entities/profile';

export const useCreateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateProfileInput) => {
      throw new Error('Not implemented - inject repository');
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile', data.userId] });
    },
  });
};
`;
  fileUtils.writeFile('features/profile/presentation/hooks/use-create-profile.ts', useCreateProfile);
};

const createRepository = (backend) => {
  fileUtils.ensureDirectory('features/profile/data/repositories');

  if (backend === 'supabase') {
    templateUtils.generateFromTemplate(
      'backend/supabase/profile-repository.ts.template',
      'features/profile/data/repositories/supabase-profile-repository.ts'
    );
  } else if (backend === 'custom-api') {
    templateUtils.generateFromTemplate(
      'backend/custom-api/profile-repository.ts.template',
      'features/profile/data/repositories/api-profile-repository.ts'
    );
  } else {
    const placeholder = `import type { ProfileRepository } from '@/features/profile/domain/repositories/profile-repository';

export const createPlaceholderProfileRepository = (): ProfileRepository => ({
  fetchProfile: async () => {
    throw new Error('Not implemented - configure a backend first');
  },
  createProfile: async () => {
    throw new Error('Not implemented - configure a backend first');
  },
  updateProfile: async () => {
    throw new Error('Not implemented - configure a backend first');
  },
});
`;
    fileUtils.writeFile('features/profile/data/repositories/placeholder-profile-repository.ts', placeholder);
  }
};

const createTestStructure = () => {
  fileUtils.ensureDirectory('__tests__/features/profile/domain/usecases');
  fileUtils.ensureDirectory('__tests__/features/profile/presentation/hooks');
  fileUtils.writeFile('__tests__/features/profile/domain/usecases/.gitkeep', '');
  fileUtils.writeFile('__tests__/features/profile/presentation/hooks/.gitkeep', '');
};

const run = async () => {
  logger.header('Add Profile Feature');

  if (!checkAuthInstalled()) {
    logger.error('Auth feature is required for profile');
    logger.info('Run: npm run add:auth first');
    process.exit(1);
  }

  if (fileUtils.directoryExists('features/profile')) {
    logger.warning('Profile feature already exists');
    const shouldOverwrite = await promptUtils.confirm('Do you want to overwrite it?');
    if (!shouldOverwrite) {
      logger.info('Operation cancelled');
      process.exit(0);
    }
    fileUtils.deleteDirectory('features/profile');
    fileUtils.deleteDirectory('__tests__/features/profile');
  }

  const backend = detectBackend();
  if (!backend) {
    logger.warning('No backend detected. A placeholder repository will be created.');
  } else {
    logger.info(`Detected backend: ${backend}`);
  }

  if (!promptUtils.isForceMode()) {
    const confirmed = await promptUtils.confirm('Proceed with profile feature installation?');
    if (!confirmed) {
      logger.info('Operation cancelled');
      process.exit(0);
    }
  }

  const totalSteps = 4;
  let currentStep = 0;

  logger.step(++currentStep, totalSteps, 'Creating domain layer');
  createProfileDomain();

  logger.step(++currentStep, totalSteps, 'Creating data layer');
  createRepository(backend);

  logger.step(++currentStep, totalSteps, 'Creating presentation layer');
  createProfilePresentation();

  logger.step(++currentStep, totalSteps, 'Creating test structure');
  createTestStructure();

  logger.divider();
  logger.success('Profile feature has been added successfully!');
  logger.divider();
  logger.info('Next steps:');
  logger.list([
    'Update hooks to inject the repository',
    'Add profile page if needed',
    'Configure your backend repository',
  ]);
};

run().catch((error) => {
  logger.error(`Failed: ${error.message}`);
  process.exit(1);
});
