import type { AudioRepository } from '@/features/audio/domain/repositories/audio-repository';

let repository: AudioRepository | null = null;

export const initializeAudioRepository = (repo: AudioRepository): void => {
  repository = repo;
};

export const getAudioRepository = (): AudioRepository => {
  if (!repository) {
    throw new Error('Audio repository not initialized. Call initializeAudioRepository first.');
  }
  return repository;
};
