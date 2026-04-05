import { useAudioStore } from '@/features/audio/presentation/store/audio-store';

export const useAudioRecorder = () => {
  const isRecording = useAudioStore((state) => state.isRecording);
  const isPlaying = useAudioStore((state) => state.isPlaying);
  const amplitudeSamples = useAudioStore((state) => state.amplitudeSamples);
  const currentTimeMs = useAudioStore((state) => state.currentTimeMs);
  const recordedUri = useAudioStore((state) => state.recordedUri);
  const error = useAudioStore((state) => state.error);
  const startRecording = useAudioStore((state) => state.startRecording);
  const stopRecording = useAudioStore((state) => state.stopRecording);
  const startPlayback = useAudioStore((state) => state.startPlayback);
  const stopPlayback = useAudioStore((state) => state.stopPlayback);
  const clearError = useAudioStore((state) => state.clearError);

  return {
    isRecording,
    isPlaying,
    amplitudeSamples,
    currentTimeMs,
    recordedUri,
    error,
    startRecording,
    stopRecording,
    startPlayback,
    stopPlayback,
    clearError,
  };
};
