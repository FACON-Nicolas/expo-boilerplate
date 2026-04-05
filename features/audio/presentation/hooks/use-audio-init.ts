import { RecordingPresets, useAudioPlayer, useAudioRecorder as useExpoAudioRecorder } from 'expo-audio';
import { useRef } from 'react';

import { createExpoAudioRepository } from '@/features/audio/data/repositories/expo-audio-repository';
import { initializeAudioRepository } from '@/features/audio/presentation/store/audio-repository';
import { initializeAudioStore } from '@/features/audio/presentation/store/audio-store';

export const useAudioInit = (): void => {
  const recorder = useExpoAudioRecorder({
    ...RecordingPresets.HIGH_QUALITY,
    isMeteringEnabled: true,
  });
  const player = useAudioPlayer(null);
  const isInitialized = useRef(false);

  if (!isInitialized.current) {
    isInitialized.current = true;
    const repository = createExpoAudioRepository(recorder, player);
    initializeAudioRepository(repository);
    initializeAudioStore(repository);
  }
};
