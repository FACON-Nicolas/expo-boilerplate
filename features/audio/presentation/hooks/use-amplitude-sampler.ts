import { useEffect } from 'react';

import { normalizeDbfs } from '@/features/audio/domain/entities/amplitude-sample';
import { getAudioRepository } from '@/features/audio/presentation/store/audio-repository';
import { useAudioStore } from '@/features/audio/presentation/store/audio-store';

const SAMPLING_INTERVAL_MS = 60;

export const useAmplitudeSampler = (): void => {
  const isRecording = useAudioStore((state) => state.isRecording);
  const addAmplitudeSample = useAudioStore((state) => state.addAmplitudeSample);

  useEffect(() => {
    if (!isRecording) return;

    const repository = getAudioRepository();
    let isPollInFlight = false;

    const intervalId = setInterval(() => {
      if (isPollInFlight) return;
      isPollInFlight = true;
      const dbfs = repository.getMeteringDbfs();
      isPollInFlight = false;
      addAmplitudeSample({
        value: normalizeDbfs(dbfs),
        capturedAtMs: Date.now(),
      });
    }, SAMPLING_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [isRecording, addAmplitudeSample]);
};
