import { fetchProfile } from '@/features/profile/domain/usecases/fetch-profile';

import type { Profile } from '@/features/profile/domain/entities/profile';
import type { ProfileRepository } from '@/features/profile/domain/repositories/profile-repository';

const createMockProfile = (overrides?: Partial<Profile>): Profile => ({
  id: 1,
  userId: 'user-123',
  firstname: 'John',
  lastname: 'Doe',
  ageRange: '25-34',
  createdAt: '2024-01-01T00:00:00Z',
  ...overrides,
});

const createMockRepository = (overrides?: Partial<ProfileRepository>): ProfileRepository => ({
  getProfile: jest.fn().mockResolvedValue(createMockProfile()),
  createProfile: jest.fn(),
  updateProfile: jest.fn(),
  ...overrides,
});

describe('fetchProfile usecase', () => {
  it('calls repository.getProfile', async () => {
    const mockRepository = createMockRepository();

    await fetchProfile(mockRepository)();

    expect(mockRepository.getProfile).toHaveBeenCalledTimes(1);
  });

  it('returns the profile from repository', async () => {
    const expectedProfile = createMockProfile();
    const mockRepository = createMockRepository({
      getProfile: jest.fn().mockResolvedValue(expectedProfile),
    });

    const result = await fetchProfile(mockRepository)();

    expect(result).toEqual(expectedProfile);
  });

  it('propagates repository errors', async () => {
    const repositoryError = new Error('Profile not found');
    const mockRepository = createMockRepository({
      getProfile: jest.fn().mockRejectedValue(repositoryError),
    });

    await expect(fetchProfile(mockRepository)()).rejects.toThrow('Profile not found');
  });
});
