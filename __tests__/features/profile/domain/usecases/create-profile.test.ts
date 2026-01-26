import { createProfile } from '@/features/profile/domain/usecases/create-profile';

import type { Profile, CreateProfileInput } from '@/features/profile/domain/entities/profile';
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
  getProfile: jest.fn(),
  createProfile: jest.fn().mockResolvedValue(createMockProfile()),
  updateProfile: jest.fn(),
  ...overrides,
});

describe('createProfile usecase', () => {
  const validInput: CreateProfileInput = {
    firstname: 'John',
    lastname: 'Doe',
    ageRange: '25-34',
  };
  const userId = 'user-123';

  it('calls repository.createProfile with transformed data and userId', async () => {
    const mockRepository = createMockRepository();

    await createProfile(mockRepository)(validInput, userId);

    expect(mockRepository.createProfile).toHaveBeenCalledWith(
      { firstname: 'John', lastname: 'Doe', age_range: '25-34' },
      userId
    );
    expect(mockRepository.createProfile).toHaveBeenCalledTimes(1);
  });

  it('returns the created profile from repository', async () => {
    const expectedProfile = createMockProfile({ firstname: 'John', lastname: 'Doe' });
    const mockRepository = createMockRepository({
      createProfile: jest.fn().mockResolvedValue(expectedProfile),
    });

    const result = await createProfile(mockRepository)(validInput, userId);

    expect(result).toEqual(expectedProfile);
  });

  it('throws validation error for empty firstname', async () => {
    const mockRepository = createMockRepository();
    const invalidInput: CreateProfileInput = {
      firstname: '',
      lastname: 'Doe',
      ageRange: '25-34',
    };

    await expect(createProfile(mockRepository)(invalidInput, userId)).rejects.toThrow();
    expect(mockRepository.createProfile).not.toHaveBeenCalled();
  });

  it('throws validation error for empty lastname', async () => {
    const mockRepository = createMockRepository();
    const invalidInput: CreateProfileInput = {
      firstname: 'John',
      lastname: '',
      ageRange: '25-34',
    };

    await expect(createProfile(mockRepository)(invalidInput, userId)).rejects.toThrow();
    expect(mockRepository.createProfile).not.toHaveBeenCalled();
  });

  it('throws validation error for invalid ageRange', async () => {
    const mockRepository = createMockRepository();
    const invalidInput = {
      firstname: 'John',
      lastname: 'Doe',
      ageRange: 'invalid-range',
    } as unknown as CreateProfileInput;

    await expect(createProfile(mockRepository)(invalidInput, userId)).rejects.toThrow();
    expect(mockRepository.createProfile).not.toHaveBeenCalled();
  });

  it('propagates repository errors', async () => {
    const repositoryError = new Error('Database error');
    const mockRepository = createMockRepository({
      createProfile: jest.fn().mockRejectedValue(repositoryError),
    });

    await expect(createProfile(mockRepository)(validInput, userId)).rejects.toThrow('Database error');
  });
});
