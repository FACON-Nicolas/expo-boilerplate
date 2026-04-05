import { requestRecordingPermissionsAsync, setAudioModeAsync } from 'expo-audio';

import type { AudioRepository } from '@/features/audio/domain/repositories/audio-repository';
import type { AudioPlayer, AudioRecorder } from 'expo-audio';

export const createExpoAudioRepository = (
  recorder: AudioRecorder,
  player: AudioPlayer,
): AudioRepository => ({
  requestPermission: async () => {
    const { granted } = await requestRecordingPermissionsAsync();
    return granted;
  },

  startRecording: async () => {
    await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
    await recorder.prepareToRecordAsync();
    recorder.record();
  },

  stopRecording: async () => {
    await recorder.stop();
    await setAudioModeAsync({ allowsRecording: false });
    return recorder.uri ?? null;
  },

  getMeteringDbfs: () => {
    const status = recorder.getStatus();
    return status.metering ?? -160;
  },

  startPlayback: (uri: string) => {
    player.replace(uri);
    player.play();
  },

  stopPlayback: () => {
    player.pause();
  },
});
