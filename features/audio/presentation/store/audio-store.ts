import { create } from "zustand";

import { AppError } from "@/core/domain/errors/app-error";

import type { AmplitudeSample } from "@/features/audio/domain/entities/amplitude-sample";
import type { AudioRepository } from "@/features/audio/domain/repositories/audio-repository";
import type { StoreApi, UseBoundStore } from "zustand";

const MAX_BARS = 50;

type AudioState = {
  isRecording: boolean;
  isPlaying: boolean;
  amplitudeSamples: AmplitudeSample[];
  currentTimeMs: number;
  recordedUri: string | null;
  error: AppError | null;
};

type AudioActions = {
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  startPlayback: () => void;
  stopPlayback: () => void;
  addAmplitudeSample: (sample: AmplitudeSample) => void;
  setCurrentTimeMs: (ms: number) => void;
  clearError: () => void;
  clearRecording: () => void;
};

type AudioStore = AudioState & AudioActions;

const initialState: AudioState = {
  isRecording: false,
  isPlaying: false,
  amplitudeSamples: [],
  currentTimeMs: 0,
  recordedUri: null,
  error: null,
};

const createAudioStore = (
  repository: AudioRepository,
): UseBoundStore<StoreApi<AudioStore>> =>
  create<AudioStore>()((set, get) => ({
    ...initialState,

    startRecording: async () => {
      try {
        set({ error: null, recordedUri: null });
        const granted = await repository.requestPermission();
        if (!granted) {
          set({ error: AppError.unauthorized("Microphone permission denied") });
          return;
        }
        await repository.startRecording();
        set({ isRecording: true, amplitudeSamples: [], currentTimeMs: 0 });
      } catch (error: unknown) {
        set({ isRecording: false, error: AppError.fromUnknown(error) });
      }
    },

    stopRecording: async () => {
      try {
        const uri = await repository.stopRecording();
        set({ isRecording: false, recordedUri: uri });
      } catch (error: unknown) {
        set({ isRecording: false, error: AppError.fromUnknown(error) });
      }
    },

    startPlayback: () => {
      const { recordedUri } = get();
      if (!recordedUri) return;
      repository.startPlayback(recordedUri);
      set({ isPlaying: true });
    },

    stopPlayback: () => {
      repository.stopPlayback();
      set({ isPlaying: false });
    },

    addAmplitudeSample: (sample: AmplitudeSample) => {
      set((state) => ({
        amplitudeSamples: [...state.amplitudeSamples, sample].slice(-MAX_BARS),
      }));
    },

    setCurrentTimeMs: (ms: number) => {
      set({ currentTimeMs: ms });
    },

    clearError: () => {
      set({ error: null });
    },

    clearRecording: () => {
      set({
        ...initialState,
      });
    },
  }));

let audioStoreInstance: UseBoundStore<StoreApi<AudioStore>> | null = null;

export const initializeAudioStore = (repository: AudioRepository): void => {
  audioStoreInstance = createAudioStore(repository);
};

export const useAudioStore = <T>(selector: (state: AudioStore) => T): T => {
  if (!audioStoreInstance) {
    throw new Error(
      "Audio store not initialized. Call initializeAudioStore first.",
    );
  }
  return audioStoreInstance(selector);
};
